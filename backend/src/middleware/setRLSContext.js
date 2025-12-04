const pool = require("../config/db");

module.exports = async function rls(req, res, next) {
  if (!req.user) return next(); // public routes skip this

  const { tenantId, role, userId, employeeId } = req.user;

  // For safety, SUPER_ADMIN is allowed tenantId = null
  const tenantValue = tenantId ? `'${tenantId}'` : 'NULL';
  const employeeValue = employeeId ? `'${employeeId}'` : 'NULL';

  try {
    await pool.query(`SET app.tenant_id = ${tenantValue};`);
    await pool.query(`SET app.role = '${role}';`);
    await pool.query(`SET app.user_id = '${userId}';`);
    await pool.query(`SET app.employee_id = ${employeeValue};`);
  } catch (err) {
    console.error("RLS context set error:", err);
  }

  next();
};
