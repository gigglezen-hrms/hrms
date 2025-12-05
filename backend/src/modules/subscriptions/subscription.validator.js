const { z } = require('zod');

const listPlansSchema = z.object({
    query: z.object({})
});

const createPlanSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Plan name is required'),
        description: z.string().optional(),
        price_per_month: z.number().min(0, 'Price must be non-negative').optional().default(0),
        price_per_employee: z.number().min(0, 'Price per employee must be non-negative').optional().default(0),
        max_employees: z.number().int().positive().optional(),
        features: z.record(z.any()).optional(),
        plan_type: z.enum(['MONTHLY', 'YEARLY', 'HALF_YEARLY', 'QUARTERLY', 'PER_EMPLOYEE', 'TRAIL']).default('MONTHLY'),
        billing_cycle_months: z.number().int().min(1, 'Billing cycle must be at least 1 month').default(1),
        currency: z.string().length(3).default('INR'),
    }),
    query: z.object({}),
    params: z.object({})
});

const updatePlanSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Plan name is required').optional(),
        description: z.string().optional(),
        price_per_month: z.number().min(0, 'Price must be non-negative').optional(),
        price_per_employee: z.number().min(0, 'Price per employee must be non-negative').optional(),
        max_employees: z.number().int().positive().optional(),
        features: z.record(z.any()).optional(),
        plan_type: z.enum(['MONTHLY', 'YEARLY', 'HALF_YEARLY', 'QUARTERLY', 'PER_EMPLOYEE', 'TRAIL']).optional(),
        billing_cycle_months: z.number().int().min(1, 'Billing cycle must be at least 1 month').optional(),
        currency: z.string().length(3).optional(),
    }),
    query: z.object({}),
    params: z.object({
        planId: z.string().uuid()
    })
});

const deletePlanSchema = z.object({
    query: z.object({}),
    params: z.object({
        planId: z.string().uuid()
    })
});

const assignPlanSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        planId: z.string().uuid(),
        tenantId: z.string().uuid()
    })
});

const currentSubscriptionSchema = z.object({
    query: z.object({})
});

const upgradePlanSchema = z.object({
    query: z.object({}),
    params: z.object({
        planId: z.string().uuid()
    })
});

const downgradePlanSchema = z.object({
    query: z.object({}),
    params: z.object({
        planId: z.string().uuid()
    })
});

const cancelSubscriptionSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({})
});



module.exports = {
    listPlansSchema,
    createPlanSchema,
    updatePlanSchema,
    deletePlanSchema,
    assignPlanSchema,
    currentSubscriptionSchema,
    upgradePlanSchema,
    downgradePlanSchema,
    cancelSubscriptionSchema
};

