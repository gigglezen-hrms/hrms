const adminService = require("./admin.service");

exports.getSummary = async (req, res, next) => {
  try {
    const data = await adminService.getSummary(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getLastLogins = async (req, res, next) => {
  try {
    const data = await adminService.getLastLogins(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getRecentEmployees = async (req, res, next) => {
  try {
    const data = await adminService.getRecentEmployees(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getTenantProfile = async (req, res, next) => {
  try {
    const data = await adminService.getTenantProfile(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getRoleBreakdown = async (req, res, next) => {
  try {
    const data = await adminService.getRoleBreakdown(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getDepartmentCounts = async (req, res, next) => {
  try {
    const data = await adminService.getDepartmentCounts(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getDesignationCounts = async (req, res, next) => {
  try {
    const data = await adminService.getDesignationCounts(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getManagerReports = async (req, res, next) => {
  try {
    const data = await adminService.getManagerReports(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getEmployeeStatus = async (req, res, next) => {
  try {
    const data = await adminService.getEmployeeStatus(req.user.tenantId);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};
