const pool = require("../../config/db");

exports.getAllTenants = async () => {
  const res = await pool.query(
    `
      SELECT id, name, email, is_active, created_at, updated_at
      FROM tenants
      ORDER BY created_at DESC
    `
  );
  return res.rows;
};

exports.getTenantCount = async () => {
  const res = await pool.query(`SELECT COUNT(*) AS count FROM tenants`);
  return Number(res.rows[0].count);
};

exports.getEmployeeCount = async () => {
  const res = await pool.query(`SELECT COUNT(*) AS count FROM employees`);
  return Number(res.rows[0].count);
};

exports.getTenantById = async (tenantId) => {
  const res = await pool.query(
    `
      SELECT *
      FROM tenants
      WHERE id = $1
    `,
    [tenantId]
  );
  return res.rows[0] || null;
};

exports.getUsersByTenant = async (tenantId) => {
  const res = await pool.query(
    `
      SELECT id, email, role, is_active, created_at
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
    `,
    [tenantId]
  );
  return res.rows;
};

exports.updateTenantStatus = async (tenantId, isActive) => {
  const res = await pool.query(
    `
      UPDATE tenants
      SET is_active = $1, updated_at = now()
      WHERE id = $2
      RETURNING id, name, is_active
    `,
    [isActive, tenantId]
  );

  return res.rows[0] || null;
};

exports.getLoginSummary = async () => {
  const res = await pool.query(
    `
      SELECT 
        us.user_id,
        us.tenant_id,
        us.ip_address,
        us.user_agent,
        us.created_at AS login_time,
        u.email
      FROM user_sessions us
      JOIN users u ON u.id = us.user_id
      ORDER BY us.created_at DESC
    `
  );

  return res.rows;
};
