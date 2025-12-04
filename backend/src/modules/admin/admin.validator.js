const { z } = require("zod");

/**
 * ADMIN MODULE VALIDATORS
 * All endpoints return dashboard/analytics data
 * No request body validation needed for GET endpoints
 */

// ID parameter validation for future use (if needed)
exports.tenantIdParam = z.object({
  params: z.object({
    id: z.string().uuid("Invalid tenant ID format")
  })
});

// Query parameters for audit logs (optional filtering)
exports.auditLogsQuerySchema = z.object({
  query: z.object({
    limit: z.string().optional(),
    offset: z.string().optional(),
    userId: z.string().uuid().optional(),
    action: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  }).optional()
});

// Employee status filter (optional)
exports.employeeStatusSchema = z.object({
  query: z.object({
    status: z.enum(["active", "inactive", "all"]).optional(),
    limit: z.string().optional(),
    offset: z.string().optional()
  }).optional()
});
