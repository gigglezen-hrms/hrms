const router = require("express").Router();
const adminController = require("./admin.controller");
const auth = require("../../middleware/verifyJwt");
const requireRole = require("../../middleware/requireRole");
const validate = require("../../middleware/validate");
const { auditLogsQuerySchema, employeeStatusSchema } = require("./admin.validator");

// All admin routes require authenticated user
router.use(auth);

// Allow ADMIN, HR only
router.use(requireRole(["ADMIN", "HR"]));

router.get("/summary", adminController.getSummary);
router.get("/last-logins", adminController.getLastLogins);
router.get("/recent-employees", adminController.getRecentEmployees);
router.get("/tenant/profile", adminController.getTenantProfile);
router.get("/roles", adminController.getRoleBreakdown);
router.get("/department-counts", adminController.getDepartmentCounts);
router.get("/designation-counts", adminController.getDesignationCounts);
router.get("/manager-reports", adminController.getManagerReports);
router.get("/audit-logs", validate(auditLogsQuerySchema), adminController.getAuditLogs);
router.get("/employee-status", validate(employeeStatusSchema), adminController.getEmployeeStatus);

module.exports = router;
