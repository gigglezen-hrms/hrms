const {
    AppError,
    BadRequestError,
    NotFoundError,
    ConflictError
} = require("../../utils/customErrors");

class SubscriptionService {

    
    _throw(status, message) {
        throw new AppError(message, status);
    }

    
    async _getPlanCycle(db, planId) {
        try {
            const planRes = await db.query(
                `SELECT plan_type, billing_cycle_months 
                 FROM subscription_plans 
                 WHERE id=$1`,
                [planId]
            );

            if (planRes.rowCount === 0) {
                throw new NotFoundError("Invalid plan");
            }

            const plan = planRes.rows[0];

            return (
                plan.billing_cycle_months ||
                (plan.plan_type === "QUARTERLY" ? 3 :
                    plan.plan_type === "HALF_YEARLY" ? 6 :
                    plan.plan_type === "YEARLY" ? 12 : 1)
            );

        } catch (err) {
            throw err;
        }
    }

    
    async listPlans(db) {
        try {
            const res = await db.query(
                `SELECT * FROM subscription_plans ORDER BY price_per_month`
            );
            return res.rows;
        } catch (err) {
            throw err;
        }
    }

    
    async createPlan(db, planData, userId) {
        try {
            const {
                name,
                description,
                price_per_month,
                price_per_employee,
                max_employees,
                features,
                plan_type,
                billing_cycle_months,
                currency,
                trial_duration_days
            } = planData || {};

            if (!name) throw new BadRequestError("Plan name is required");

            const pricePerMonth = Number(price_per_month) || 0;
            const pricePerEmployee = Number(price_per_employee) || 0;
            const maxEmployees = max_employees != null ? Number(max_employees) : null;
            const billingMonths = Number(billing_cycle_months) || 1;
            const trialDays = trial_duration_days != null ? Number(trial_duration_days) : null;
            const normalizedPlanType = (plan_type || "MONTHLY").toUpperCase();

            let featuresJson = null;

            if (features) {
                if (typeof features === "string") {
                    try {
                        featuresJson = JSON.parse(features);
                    } catch {
                        featuresJson = { value: features };
                    }
                } else {
                    featuresJson = features;
                }
            }

            
            const exists = await db.query(
                `SELECT 1 FROM subscription_plans WHERE LOWER(name) = LOWER($1) LIMIT 1`,
                [name]
            );

            if (exists.rowCount > 0) {
                throw new ConflictError("A plan with this name already exists");
            }

            const res = await db.query(
                `INSERT INTO subscription_plans
                (name, description, price_per_month, price_per_employee, max_employees,
                 features, plan_type, billing_cycle_months, currency, trial_duration_days, created_by)
                VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::plan_type_enum,$8,$9,$10,$11)
                RETURNING *`,
                [
                    name,
                    description || null,
                    pricePerMonth,
                    pricePerEmployee,
                    maxEmployees,
                    featuresJson ? JSON.stringify(featuresJson) : null,
                    normalizedPlanType,
                    billingMonths,
                    currency || "INR",
                    trialDays,
                    userId
                ]
            );

            return res.rows[0];

        } catch (err) {
            throw err;
        }
    }

    
    async updatePlan(db, planId, planData) {
        try {
            const {
                name,
                description,
                price_per_month,
                price_per_employee,
                max_employees,
                features,
                plan_type,
                billing_cycle_months,
                currency,
                trial_duration_days,
                userId
            } = planData;

            const res = await db.query(
                `UPDATE subscription_plans
                SET name=$1, description=$2, price_per_month=$3, price_per_employee=$4,
                    max_employees=$5, features=$6, plan_type=$7, billing_cycle_months=$8,
                    currency=$9, trial_duration_days=$10, updated_by=$11, updated_at=now()
                WHERE id=$12
                RETURNING *`,
                [
                    name, description, price_per_month, price_per_employee, max_employees,
                    JSON.stringify(features), plan_type, billing_cycle_months, currency,
                    trial_duration_days, userId, planId
                ]
            );

            if (res.rowCount === 0) throw new NotFoundError("Plan not found");

            return res.rows[0];

        } catch (err) {
            throw err;
        }
    }

    
    async deletePlan(db, planId) {
        try {
            const inUse = await db.query(
                `SELECT 1 FROM tenant_subscription WHERE plan_id=$1 LIMIT 1`,
                [planId]
            );

            if (inUse.rowCount > 0) {
                throw new AppError("Cannot delete plan that is in use", 400);
            }

            const res = await db.query(
                `DELETE FROM subscription_plans WHERE id=$1 RETURNING *`,
                [planId]
            );

            if (res.rowCount === 0) throw new NotFoundError("Plan not found");

            return res.rows[0];

        } catch (err) {
            throw err;
        }
    }

   
    async assignPlan(db, tenantId, planId, userId) {
        try {
            if (!tenantId) throw new BadRequestError("Missing tenantId");
            if (!planId) throw new BadRequestError("Missing planId");

            const active = await db.query(
                `SELECT 1 FROM tenant_subscription 
                 WHERE tenant_id=$1 AND status='ACTIVE'`,
                [tenantId]
            );

            if (active.rowCount > 0) {
                throw new ConflictError("Tenant already has an active subscription");
            }

            const months = await this._getPlanCycle(db, planId);

            const res = await db.query(
                `INSERT INTO tenant_subscription
                (tenant_id, plan_id, start_date, end_date, status, created_by, updated_by)
                VALUES ($1,$2,current_date,
                (current_date + make_interval(months => $4))::date,
                'ACTIVE',$3,$3)
                RETURNING *`,
                [tenantId, planId, userId, months]
            );

            return res.rows[0];

        } catch (err) {
            throw err;
        }
    }

    
    async currentSubscription(db, tenantId) {
        try {
            const res = await db.query(
                `SELECT ts.*, sp.name AS plan_name
                 FROM tenant_subscription ts
                 JOIN subscription_plans sp ON ts.plan_id = sp.id
                 WHERE ts.tenant_id=$1 AND ts.status IN ('ACTIVE','TRIAL')
                 ORDER BY ts.start_date DESC LIMIT 1`,
                [tenantId]
            );

            return res.rows[0] || null;

        } catch (err) {
            throw err;
        }
    }

   
    async upgradePlan(db, tenantId, newPlanId, userId) {
        try {
            const currentPlan = await db.query(
                `select plan_id from tenant_subscription
                 where tenant_id=$1 AND status IN ('ACTIVE','TRIAL')
                 ORDER BY start_date DESC LIMIT 1`,
                [tenantId]
            );

            if (currentPlan.rowCount > 0 && currentPlan.rows[0].plan_id == newPlanId) { this._throw(400, "Already on the requested plan"); }
            await db.query(
                `UPDATE tenant_subscription
                 SET status='INACTIVE', end_date=now(), updated_by=$1, updated_at=now()
                 WHERE tenant_id=$2 AND status IN ('ACTIVE','TRIAL')`,
                [userId, tenantId]
            );

            const months = await this._getPlanCycle(db, newPlanId);

            const res = await db.query(
                `INSERT INTO tenant_subscription
                 (tenant_id, plan_id, start_date, end_date, status, created_by, updated_by)
                 VALUES ($1,$2,now(),
                 (current_date + make_interval(months => $4))::date,
                 'ACTIVE',$3,$3)
                 RETURNING *`,
                [tenantId, newPlanId, userId, months]
            );

            return res.rows[0];

        } catch (err) {
            throw err;
        }
    }

   
    async downgradePlan(db, tenantId, newPlanId, userId) {
        try {
            const currentPlan = await db.query(
                `select plan_id from tenant_subscription
                 where tenant_id=$1 AND status IN ('ACTIVE','TRIAL')
                 ORDER BY start_date DESC LIMIT 1`,
                [tenantId]
            );

            if (currentPlan.rowCount > 0 && currentPlan.rows[0].plan_id == newPlanId) { this._throw(400, "Already on the requested plan"); }
            await db.query(
                `UPDATE tenant_subscription
                 SET status='INACTIVE', end_date=now(), updated_by=$1, updated_at=now()
                 WHERE tenant_id=$2 AND status IN ('ACTIVE','TRIAL')`,
                [userId, tenantId]
            );

            const months = await this._getPlanCycle(db, newPlanId);

            const res = await db.query(
                `INSERT INTO tenant_subscription
                 (tenant_id, plan_id, start_date, end_date, status, created_by, updated_by)
                 VALUES ($1,$2,now(),
                 (current_date + make_interval(months => $4))::date,
                 'ACTIVE',$3,$3)
                 RETURNING *`,
                [tenantId, newPlanId, userId, months]
            );

            return res.rows[0];

        } catch (err) {
            throw err;
        }
    }

    
    async cancelSubscription(db, tenantId, userId) {
        try {
            const res = await db.query(
                `UPDATE tenant_subscription
                 SET status='CANCELLED', end_date=now(), updated_by=$1, updated_at=now()
                 WHERE tenant_id=$2 AND status IN ('ACTIVE','TRIAL')
                 RETURNING *`,
                [userId, tenantId]
            );

            return res.rows[0] || null;

        } catch (err) {
            throw err;
        }
    }

    
    async getSubscriptionStatus(db, tenantId) {
        try {
            const res = await db.query(
                `SELECT 
                    ts.*,
                    sp.name AS plan_name,
                    sp.plan_type,
                    sp.billing_cycle_months,
                    sp.currency,
                    sp.price_per_month,
                    sp.price_per_employee,
                    sp.max_employees,
                    EXTRACT(DAY FROM (ts.end_date - now()))::INTEGER AS days_remaining,
                    CASE 
                        WHEN ts.end_date IS NOT NULL AND ts.end_date < now() 
                        THEN true ELSE false 
                    END AS is_expired
                 FROM tenant_subscription ts
                 JOIN subscription_plans sp ON ts.plan_id = sp.id
                 WHERE ts.tenant_id=$1 AND ts.status IN ('ACTIVE','TRIAL')
                 ORDER BY ts.start_date DESC LIMIT 1`,
                [tenantId]
            );

            return res.rows[0] || null;

        } catch (err) {
            throw err;
        }
    }
}

module.exports = new SubscriptionService();
