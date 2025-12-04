const router = require("express").Router();
const controller = require("./user.controller");
const validate = require("../../middleware/validate");
const verifyJwt = require("../../middleware/verifyJwt");
const requireRole = require("../../middleware/requireRole");
const {
  createUserSchema,
  getUsersSchema,
  updateUserSchema,
  updateEmployeeSchema,
  changeRoleSchema,
  changeManagerSchema,
  assignDeptSchema,
  assignDesignationSchema,
  statusSchema
} = require("./user.validator");

// CREATE USER — Admin + HR
router.post(
  "/",
  verifyJwt,
  requireRole(["ADMIN", "HR"]),
  validate(createUserSchema),
  controller.createUser
);
// LIST USERS
router.get(
  "/",
  verifyJwt,
  validate(getUsersSchema),
  controller.getUsers
);controller.getUsers


// GET ONE USER
router.get(
  "/:id",
  verifyJwt,
  controller.getUserById
);
// UPDATE USER BASIC INFO
router.put(
  "/:id",
  verifyJwt,
  validate(updateUserSchema),
  controller.updateUser
);controller.updateUser

// UPDATE EMPLOYEE DETAILS
router.put(
  "/:id/employee",
  verifyJwt,
  validate(updateEmployeeSchema),
  controller.updateEmployee
);controller.updateEmployee

// CHANGE ROLE
router.put(
  "/:id/role",
  verifyJwt,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  validate(changeRoleSchema),
  controller.changeRole
);controller.changeRole
// CHANGE MANAGER
router.put(
  "/:id/manager",
  verifyJwt,
  validate(changeManagerSchema),
  controller.changeManager
);verifyJwt,
  controller.changeManager
// ASSIGN DEPARTMENT
router.put(
  "/:id/department",
  verifyJwt,
  validate(assignDeptSchema),
  controller.assignDepartment
);verifyJwt,
  controller.assignDepartment
// ASSIGN DESIGNATION
router.put(
  "/:id/designation",
  verifyJwt,
  validate(assignDesignationSchema),
  controller.assignDesignation
);verifyJwt,
// ACTIVATE / DEACTIVATE USER
router.put(
  "/:id/status",
  verifyJwt,
  validate(statusSchema),
  controller.updateUser
);"/:id/status",
  verifyJwt,
  controller.updateUser


module.exports = router;
