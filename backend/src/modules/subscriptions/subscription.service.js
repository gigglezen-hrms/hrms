class SubscriptionService {

    async _getPlanCycle(db, planId) {
    const planRes = await db.query(
        `SELECT plan_type, billing_cycle_months FROM subscription_plans WHERE id=$1`,
        [planId]
    );

    
    const plan = planRes.rows[0];
    if (!plan) throw new Error("Invalid plan");

    return plan.billing_cycle_months || (
        plan.plan_type === 'QUARTERLY' ? 3 :
        plan.plan_type === 'HALF_YEARLY' ? 6 :
        plan.plan_type === 'YEARLY' ? 12 : 1
    );
}


    async listPlans(db) {
        const res = await db.query(`
            SELECT *
            FROM subscription_plans
            ORDER BY price_per_month`);
        return res.rows;
    }

    async createPlan(db, planData, user) {

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
    } = planData || {};

    const userId = user?.userId;

    if (!name) throw new Error('Plan name is required');

   
    const pricePerMonth = Number(price_per_month) || 0;
    const pricePerEmployee = Number(price_per_employee) || 0;
    const maxEmployees = max_employees != null ? Number(max_employees) : null;
    const billingMonths = Number(billing_cycle_months) || 1;
    const trialDays = (trial_duration_days != null) ? Number(trial_duration_days) : null;
    const normalizedPlanType = (plan_type || 'MONTHLY').toUpperCase();

    
    let featuresJson = null;
    if (features) {
        if (typeof features === 'string') {
            try { featuresJson = JSON.parse(features); } catch (e) { featuresJson = { description: features }; }
        } else if (typeof features === 'object') {
            featuresJson = features;
        }
    }

    try {
        const { tenantId, userId:dbUserId, employeeId} = user || {};
        if (tenantId) await db.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantId]); else await db.query(`RESET app.tenant_id`);
        if (dbUserId) await db.query(`SELECT set_config('app.user_id', $1, true)`, [dbUserId]); else await db.query(`RESET app.user_id`);
        if (employeeId) await db.query(`SELECT set_config('app.employee_id', $1, true)`, [employeeId]); else await db.query(`RESET app.employee_id`);
    }catch{}

    const exists = await db.query(
        `SELECT 1 FROM subscription_plans WHERE LOWER(name) = LOWER($1) LIMIT 1`,
        [name]
    );

    if (exists.rowCount > 0) {
        throw new Error(409,'A plan with this name already exists');
    }

    

        const res = await db.query(
            `INSERT INTO subscription_plans
            (name, description, price_per_month, price_per_employee, max_employees, 
             features, plan_type, billing_cycle_months, currency, trial_duration_days,created_by)
            VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::plan_type_enum, $8, $9, $10, $11)
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
                currency || 'INR',
                trialDays,
                userId
            ]
        );

        return res.rows[0];
   
}


    async updatePlan(db, planId, planData) {
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
            SET name = $1, description = $2, price_per_month = $3, price_per_employee = $4,
                max_employees = $5, features = $6, plan_type = $7, billing_cycle_months = $8,
                currency = $9, trial_duration_days = $10, 
                updated_by = $11, updated_at = now()
            WHERE id = $12
            RETURNING *`,
            [name, description, price_per_month, price_per_employee, max_employees,
             JSON.stringify(features), plan_type, billing_cycle_months, currency,
             trial_duration_days, userId || null, planId]
        );

        if (res.rowCount === 0) {
            throw new Error('Plan not found');
        }

        return res.rows[0];
    }

    async deletePlan(db, planId) {
        const inUse = await db.query(
            `SELECT 1 FROM tenant_subscription WHERE plan_id = $1 LIMIT 1`,
            [planId]
        );

        if (inUse.rowCount > 0) {
            throw new Error('Cannot delete plan that is in use by subscriptions');
        }

        const res = await db.query(
            `DELETE FROM subscription_plans WHERE id = $1 RETURNING *`,
            [planId]
        );

        if (res.rowCount === 0) {
            throw new Error('Plan not found');
        }

        return res.rows[0];
    }

    async assignPlan(db, tenantId, planId, userId) {
        console.log("Assigning plan", { tenantId, planId, userId });

        await db.query(
            `SELECT 1 FROM tenant_subscription
             WHERE tenant_id=$1 AND status IN ('ACTIVE')`,
            [tenantId]
        ).then(r => {
            if (r.rowCount > 0) {
                const err = new Error("Tenant already has an active subscription");
                err.status = 409;
                throw err;
            }

        });

        
        const months = await this._getPlanCycle(db, planId);

        const res = await db.query(
            `
      INSERT INTO tenant_subscription
      (tenant_id, plan_id, start_date, end_date, status, created_by, updated_by)
      VALUES ($1,$2,current_date,
      (current_date + make_interval(months => $4))::date,  
      'ACTIVE',$3,$3)
      RETURNING *`,
            [tenantId, planId, userId || null, months]
        );

        return res.rows[0];
    }

    async currentSubscription(db, tenantId) {
        

        const res = await db.query(
            `
      SELECT ts.*, sp.name AS plan_name
      FROM tenant_subscription ts
      JOIN subscription_plans sp ON ts.plan_id = sp.id
      WHERE ts.tenant_id=$1 AND ts.status IN ('ACTIVE', 'TRIAL')
      ORDER BY ts.start_date DESC LIMIT 1
      `,
            [tenantId]
        );
        return res.rows[0] || null;
    }

    async getTrialPlan(db) {
        const res = await db.query(
            `SELECT * FROM subscription_plans WHERE is_trial = true LIMIT 1`
        );
        return res.rows[0] || null;
    }

    async assignPlanWithTrial(db, tenantId, planId, userId) {

        // ADDED avoid multiple subs
        await db.query(
            `SELECT 1 FROM tenant_subscription
             WHERE tenant_id=$1 AND status IN ('ACTIVE','TRIAL')`,
            [tenantId]
        ).then(r => {
            if (r.rowCount > 0) throw new Error("Active subscription exists");
        });

        const planRes = await db.query(
            `SELECT trial_duration_days FROM subscription_plans WHERE id = $1`,
            [planId]
        );

        const plan = planRes.rows[0];
        

        let endDateQuery = 'NULL';
        if (isTrial && plan && plan.trial_duration_days) {
            endDateQuery = `current_date + interval '${plan.trial_duration_days} days'`;
        }

        const res = await db.query(
            `
      INSERT INTO tenant_subscription
      (tenant_id, plan_id, start_date, end_date,  created_by, updated_by)
      VALUES ($1, $2, current_date, ${endDateQuery}, $3, $3)
      RETURNING *`,
            [tenantId, planId, userId || null]
        );

        return res.rows[0];
    }

    async upgradePlan(db, tenantId, newPlanId, userId) {

        await db.query(
            `
      UPDATE tenant_subscription
      SET status = 'INACTIVE', end_date = now(), updated_by = $1, updated_at = now()
      WHERE tenant_id = $2 AND status IN ('ACTIVE', 'TRIAL')
      `,
            [userId || null, tenantId]
        );

        

        // ADDED fetch billing cycle
        const months = await this._getPlanCycle(db, newPlanId);

        const res = await db.query(
            `
      INSERT INTO tenant_subscription
      (tenant_id, plan_id, start_date, end_date, status, created_by, updated_by)
      VALUES ($1, $2, now(),
      (current_date + make_interval(months => $4))::date,    
      'ACTIVE', $3, $3)
      RETURNING *`,
            [tenantId, newPlanId, userId || null, months]
        );

        return res.rows[0];
    }


    // Downgrade (same update as upgrade)
    async downgradePlan(db, tenantId, newPlanId, userId) {

        await db.query(
            `
      UPDATE tenant_subscription
      SET status = 'INACTIVE', end_date = now(), updated_by = $1, updated_at = now()
      WHERE tenant_id = $2 AND status IN ('ACTIVE', 'TRIAL')
      `,
            [userId || null, tenantId]
        );

        // ADDED fetch billing cycle
        const months = await this._getPlanCycle(db, newPlanId);

        const res = await db.query(
            `
      INSERT INTO tenant_subscription
      (tenant_id, plan_id, start_date, end_date, status, created_by, updated_by)
      VALUES ($1, $2, now(),
      (current_date + make_interval(months => $4))::date,   -- ADDED
      'ACTIVE', $3, $3)
      RETURNING *`,
            [tenantId, newPlanId, userId || null, months]
        );

        return res.rows[0];
    }


    async cancelSubscription(db, tenantId, userId) {
        const res = await db.query(
            `
      UPDATE tenant_subscription
      SET status = 'CANCELLED', end_date = now(), updated_by = $1, updated_at = now()
      WHERE tenant_id = $2 AND status IN ('ACTIVE', 'TRIAL')
      RETURNING *`,
            [userId || null, tenantId]
        );

        return res.rows[0] || null;
    }


    async getSubscriptionStatus(db, tenantId) {
        const res = await db.query(
            `
      SELECT 
        ts.*,
        sp.name AS plan_name,
        sp.plan_type,               
        sp.billing_cycle_months,    
        sp.currency,                
        sp.price_per_month,
        sp.price_per_employee,      
        sp.max_employees,
        CASE 
          WHEN ts.end_date IS NOT NULL THEN 
            EXTRACT(DAY FROM (ts.end_date - now()))::INTEGER
          ELSE NULL
        END AS days_remaining,
        CASE 
          WHEN ts.end_date IS NOT NULL AND ts.end_date < now() THEN true
          ELSE false
        END AS is_expired
      FROM tenant_subscription ts
      JOIN subscription_plans sp ON ts.plan_id = sp.id
      WHERE ts.tenant_id = $1 AND ts.status IN ('ACTIVE', 'TRIAL')
      ORDER BY ts.start_date DESC 
      LIMIT 1
      `,
            [tenantId]
        );

        
        return res.rows[0] ;
    

    }
}

module.exports = new SubscriptionService();
