const express = require("express");
const router = express.Router();

const verifyJwt = require("../../middleware/verifyJwt");
const requireRole = require("../../middleware/requireRole");

const controller = require("./department.controller");
const validator = require("./department.validator");
const validate = require("../../middleware/validate");

router.use(verifyJwt);

// ADMIN + HR
router.post(
  "/",
  requireRole(["ADMIN", "HR"]),
  validate(validator.createDepartmentSchema),
  controller.createDepartment
);

router.get(
  "/",
  requireRole(["ADMIN", "HR"]),
  controller.getDepartments
);

router.get(
  "/:id",
  requireRole(["ADMIN", "HR"]),
  controller.getDepartmentById
);
router.patch(
  "/:id",
  requireRole(["ADMIN", "HR"]),
  validate(validator.updateDepartmentSchema),
  controller.updateDepartment
);controller.updateDepartment

// ADMIN ONLY
router.delete(
  "/:id",
  requireRole(["ADMIN"]),
  controller.deleteDepartment
);

module.exports = router;
