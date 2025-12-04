const { z } = require("zod");

const uuidOrNull = z.string().uuid().optional();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * USER MODULE VALIDATORS
 * Handles user creation, updates, and role management
 */

/**
 * CREATE USER (ADMIN + HR)
 * Only HR, MANAGER, EMPLOYEE allowed
 * ADMIN creation is forbidden here
 */
exports.createUserSchema = z.object({
  body: z.object({
    email: z.string()
      .email("Invalid email format")
      .max(255, "Email must not exceed 255 characters"),
    role: z.enum(["HR", "MANAGER", "EMPLOYEE"], {
      errorMap: () => ({ message: "Role must be HR, MANAGER, or EMPLOYEE" })
    }),
    first_name: z.string()
      .min(1, "First name is required")
      .max(100, "First name must not exceed 100 characters"),
    last_name: z.string()
      .max(100, "Last name must not exceed 100 characters")
      .optional(),
    phone: z.string()
      .max(20, "Phone must not exceed 20 characters")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    department_id: uuidOrNull,
    designation_id: uuidOrNull,
    reports_to: uuidOrNull
  })
});

/**
 * GET LIST USERS
 * Supports filtering and pagination
 */
exports.getUsersSchema = z.object({
  query: z.object({
    role: z.enum(["HR", "MANAGER", "EMPLOYEE", "ADMIN"]).optional(),
    departmentId: z.string().uuid().optional(),
    search: z.string().max(255).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    offset: z.string().regex(/^\d+$/).optional()
  }).optional()
});

/**
 * BASIC USER UPDATE
 * Updates email and active status
 */
exports.updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").optional(),
    is_active: z.boolean().optional()
  }).optional()
});

/**
 * EMPLOYEE PROFILE UPDATE
 * Updates employee-specific details
 */
exports.updateEmployeeSchema = z.object({
  body: z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().max(100).optional(),
    phone: z.string().max(20).optional().or(z.literal("").transform(() => undefined)),
    department_id: uuidOrNull,
    designation_id: uuidOrNull,
    reports_to: uuidOrNull
  })
});

/**
 * ROLE CHANGE
 * ADMIN/SUPER_ADMIN ONLY
 * Changes user role
 */
exports.changeRoleSchema = z.object({
  body: z.object({
    role: z.enum(["HR", "MANAGER", "EMPLOYEE", "ADMIN"], {
      errorMap: () => ({ message: "Invalid role assignment" })
    })
  })
});

/**
 * CHANGE MANAGER
 * Updates reporting manager for employee
 */
exports.changeManagerSchema = z.object({
  body: z.object({
    manager_employee_id: z.string().uuid("Invalid manager ID format")
  })
});

/**
 * ASSIGN DEPARTMENT
 * ADMIN/HR ONLY
 * Assigns employee to department
 */
exports.assignDeptSchema = z.object({
  body: z.object({
    department_id: z.string().uuid("Invalid department ID format")
  })
});

/**
 * ASSIGN DESIGNATION
 * ADMIN/HR ONLY
 * Assigns job designation to employee
 */
exports.assignDesignationSchema = z.object({
  body: z.object({
    designation_id: z.string().uuid("Invalid designation ID format")
  })
});

/**
 * UPDATE USER STATUS
 * Activates/deactivates user account
 */
exports.statusSchema = z.object({
  body: z.object({
    is_active: z.boolean("is_active must be a boolean")
  })
});

/**
 * USER ID PARAMETER VALIDATION
 */
exports.userIdParam = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format")
  })
});
