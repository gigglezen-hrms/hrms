const departmentService = require("./department.service");
const validate = require("../../middleware/validate");

exports.createDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.createDepartment(req.db, req.body, req.user);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const result = await departmentService.getDepartments(req.db, req.user);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const result = await departmentService.getDepartmentById(req.db, req.params.id, req.user);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.updateDepartment(
      req.db,
      req.params.id,
      req.body,
      req.user
    );
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.deleteDepartment(req.db, req.params.id, req.user);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};
