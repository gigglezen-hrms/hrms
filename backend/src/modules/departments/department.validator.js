const { z } = require("zod");

/**
 * DEPARTMENT MODULE VALIDATORS
 * Handles department CRUD operations
 */

/**
 * CREATE DEPARTMENT VALIDATION
 * ADMIN + HR ONLY
 * Validates department creation
 */
exports.createDepartmentSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Department name must be at least 2 characters")
      .max(255, "Department name must not exceed 255 characters")
      .trim(),
    description: z.string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional()
      .or(z.literal("").transform(() => undefined))
  })
});

/**
 * UPDATE DEPARTMENT VALIDATION
 * ADMIN + HR ONLY
 * Validates department updates
 */
exports.updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Department name must be at least 2 characters")
      .max(255, "Department name must not exceed 255 characters")
      .optional(),
    description: z.string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    is_active: z.boolean().optional()
  })
});

/**
 * DEPARTMENT ID PARAMETER VALIDATION
 */
exports.departmentIdParam = z.object({
  params: z.object({
    id: z.string().uuid("Invalid department ID format")
  })
});

/**
 * DEPARTMENTS QUERY VALIDATION
 * Optional filters for listing departments
 */
exports.departmentsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(["active", "inactive", "all"]).optional(),
    limit: z.string().optional(),
    offset: z.string().optional()
  }).optional()
});
