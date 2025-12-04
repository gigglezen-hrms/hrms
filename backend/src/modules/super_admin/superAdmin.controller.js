const service = require("./superAdmin.service.js");

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await service.getAllTenants(req);
    res.json({ status: "success", tenants });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const tenant = await service.getTenantById(req, req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json({ status: "success", tenant });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.activateTenant = async (req, res) => {
  try {
    const updated = await service.updateTenantStatus(req, req.params.id, true);
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deactivateTenant = async (req, res) => {
  try {
    const updated = await service.updateTenantStatus(req, req.params.id, false);
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getUsersByTenant = async (req, res) => {
  try {
    const users = await service.getUsersByTenant(req, req.params.id);
    res.json({ status: "success", users });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTenantEmployeeCount = async (req, res) => {
  try {
    const count = await service.getTenantEmployeeCount(req, req.params.id);
    res.json({ status: "success", employees: count });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await service.getSystemStats(req);
    res.json({ status: "success", stats });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getLoginSummary = async (req, res) => {
  try {
    const logins = await service.getLoginSummary(req);
    res.json({ status: "success", logins });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
