const userService = require("./user.service");

exports.createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.db, req.body, req.user);

    res.status(201).json({
      status: "success",
      message: "User created successfully. Temporary password sent via email.",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.db, req.query, req.user);
    res.json({ status: "success", users });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.db, req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.db, req.params.id, req.body, req.user);
    res.json({ status: "success", updated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updated = await userService.updateEmployee(req.db, req.params.id, req.body, req.user);
    res.json({ status: "success", updated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const result = await userService.changeRole(req.db, req.params.id, req.body.role, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.changeManager = async (req, res) => {
  try {
    const result = await userService.changeManager(req.db, req.params.id, req.body.manager_employee_id, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.assignDepartment = async (req, res) => {
  try {
    const result = await userService.assignDepartment(req.db, req.params.id, req.body.department_id, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.assignDesignation = async (req, res) => {
  try {
    const result = await userService.assignDesignation(req.db, req.params.id, req.body.designation_id, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const result = await userService.deactivateUser(req.db, req.params.id, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const result = await userService.activateUser(req.db, req.params.id, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const result = await userService.updateUserStatus(req.db, req.params.id, req.body.is_active, req.user);
    res.json({ status: "success", result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await userService.getMyProfile(req.db, req.user);
    res.json({ status: "success", profile });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const updated = await userService.updateMyProfile(req.db, req.user, req.body);
    res.json({ status: "success", updated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.getManagerDashboard = async (req, res) => {
  try {
    const dashboard = await userService.getManagerDashboard(req.db, req.user);
    res.json({ status: "success", dashboard });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.getDirectReports = async (req, res) => {
  try {
    const reports = await userService.getDirectReports(req.db, req.user);
    res.json({ status: "success", reports });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
