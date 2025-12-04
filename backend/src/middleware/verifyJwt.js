const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const env = require("../config/env");
const { UnauthorizedError } = require("../utils/customErrors");

module.exports = async function verifyJwt(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or invalid Authorization header"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // Fetch full user details INCLUDING employee id (join employees table)
    const userRes = await pool.query(
      `
      SELECT 
          u.id,
          u.tenant_id,
          u.role,
          u.must_change_password,
          e.id AS employee_id
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.id = $1
      `,
      [decoded.id]
    );

    if (userRes.rowCount === 0) {
      return next(new UnauthorizedError("User not found"));
    }

    const user = userRes.rows[0];

    // Build req.user for controllers
    req.user = {
      id: user.user_id || user.userId || user.id,
      tenantId: user.tenant_id || user.tenantId || user.Id,
      employeeId: user.employee_id || user.employeeId || null,
      role: user.role,
      mustChangePassword: user.must_change_password
    };

    // Set PostgreSQL RLS session variables
    await pool.query(`SELECT 
        set_config('app.tenant_id', $1, true),
        set_config('app.role', $2, true),
        set_config('app.user_id', $3, true)
      `,
      [
        user.tenant_id || "",       // SUPER_ADMIN has null tenant
        user.role,
        user.id
      ]
    );

    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
