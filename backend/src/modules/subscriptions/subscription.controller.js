const subscriptionService = require('./subscription.service');
const { success } = require('../../utils/response');

class SubscriptionController {
    async listPlans(req, res, next) {
        try {
            const data = await subscriptionService.listPlans(req.db);
            return success(res, data);
        } catch (err) {
            next(err);
        }
    }

    async createPlan(req, res, next) {
        try {
            const data = await subscriptionService.createPlan(req.db, req.body,{ userId: req.user.userId });
            return success(res, data, 'Plan created successfully', 201);
        } catch (err) {
            next(err);
        }
    }

    async updatePlan(req, res, next) {
        try {
            const data = await subscriptionService.updatePlan(req.db, req.params.planId, {
                ...req.body,
                userId: req.user.userId
            });
            return success(res, data, 'Plan updated successfully', 200);
        } catch (err) {
            next(err);
        }
    }

    async deletePlan(req, res, next) {
        try {
            const data = await subscriptionService.deletePlan(req.db, req.params.planId);
            return success(res, data, 'Plan deleted successfully', 200);
        } catch (err) {
            next(err);
        }
    }

    async assignPlan(req, res, next) {
    try {
        const data = await subscriptionService.assignPlan(
            req.db,
            req.params.tenantId,   
            req.params.planId,
            req.user.userId
        );
        


        return success(res, data, 'Plan assigned successfully', 201);
    } catch (err) {
        next(err);
    }
}

    

    async currentSubscription(req, res, next) {
        try {
            const data = await subscriptionService.currentSubscription(req.db, req.user.tenantId);
            return success(res, data);
        } catch (err) {
            next(err);
        }
    }

    async upgradePlan(req, res, next) {
        try {
            const data = await subscriptionService.upgradePlan(
                req.db,
                req.user.tenantId,
                req.params.planId,
                req.user.userId
            );
            return success(res, data, 'Plan upgraded successfully', 200);
        } catch (err) {
            next(err);
        }
    }

    async downgradePlan(req, res, next) {
        try {
            const data = await subscriptionService.downgradePlan(
                req.db,
                req.user.tenantId,
                req.params.planId,
                req.user.userId
            );
            return success(res, data, 'Plan downgraded successfully', 200);
        } catch (err) {
            next(err);
        }
    }

    async cancelSubscription(req, res, next) {
        try {
            const data = await subscriptionService.cancelSubscription(
                req.db,
                req.user.tenantId,
                req.user.userId
            );
            return success(res, data, 'Subscription cancelled successfully', 200);
        } catch (err) {
            next(err);
        }
    }

    async getSubscriptionStatus(req, res, next) {
        try {
            const data = await subscriptionService.getSubscriptionStatus(req.db, req.user.tenantId);
            console.log("TENANT ID:", req.user.tenantId);
            return success(res, data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SubscriptionController();

