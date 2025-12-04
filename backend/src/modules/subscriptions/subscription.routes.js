const express = require('express');
const router = express.Router();

const auth = require('../../middleware/verifyJwt');
const setRLSContext = require('../../middleware/setRLSContext');
const requireRole = require('../../middleware/requireRole');

const controller = require('./subscription.controller');
const validate = require("../../middleware/validate");
const{
    listPlansSchema,
    createPlanSchema,
    updatePlanSchema,
    deletePlanSchema,
    assignPlanSchema,
    currentSubscriptionSchema,
    upgradePlanSchema,
    downgradePlanSchema,
    cancelSubscriptionSchema
} = require('./subscription.validator');

router.use(auth, setRLSContext());

router.get('/plans',
    validate(listPlansSchema),
    (req, res, next) => controller.listPlans(req, res, next));

router.post('/plans', requireRole(['SUPER_ADMIN']),
    validate(createPlanSchema),
    (req, res, next) => controller.createPlan(req, res, next));

router.put('/plans/:planId', requireRole(['SUPER_ADMIN']),
    validate(updatePlanSchema),
    (req, res, next) => controller.updatePlan(req, res, next));

router.delete('/plans/:planId', requireRole(['SUPER_ADMIN']),
    validate(deletePlanSchema),
    (req, res, next) => controller.deletePlan(req, res, next));

router.post('/assign/:tenantId/:planId', requireRole(['SUPER_ADMIN']),
    validate(assignPlanSchema),
    (req, res, next) => controller.assignPlan(req, res, next));

router.get('/current', requireRole(['ADMIN', 'HR']),
    validate(currentSubscriptionSchema),
    (req, res, next) => controller.currentSubscription(req, res, next));

// Upgrade to higher plan (ADMIN only)
router.post('/upgrade/:planId', requireRole(['ADMIN']),
    validate(upgradePlanSchema),
    (req, res, next) => controller.upgradePlan(req, res, next));

// Downgrade to lower plan (ADMIN only)
router.post('/downgrade/:planId', requireRole(['ADMIN']),
    validate(downgradePlanSchema),
    (req, res, next) => controller.downgradePlan(req, res, next));

// Cancel subscription (ADMIN only)
router.post('/cancel', requireRole(['ADMIN']),
    validate(cancelSubscriptionSchema),
    (req, res, next) => controller.cancelSubscription(req, res, next));

// Get detailed subscription status (ADMIN, HR)
router.get('/status', requireRole(['ADMIN', 'HR']),
    (req, res, next) => controller.getSubscriptionStatus(req, res, next));

module.exports = router;

