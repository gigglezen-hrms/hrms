const pool = require("../../config/db");

// --------------------------------------------------------
// Dashboard Summary
// --------------------------------------------------------
exports.getSummary = async (tenantId) => {
  const q = `
    SELECT
      (SELECT COUNT(*) FROM employees WHERE tenant_id=$1) AS total_employees,
      (SELECT COUNT(*) FROM users WHERE tenant_id=$1 AND is_active=true) AS active_employees,
      (SELECT COUNT(*) FROM users WHERE tenant_id=$1 AND is_active=false) AS inactive_employees,
      (SELECT COUNT(*) FROM departments WHERE tenant_id=$1) AS total_departments,
      (SELECT COUNT(*) FROM designations WHERE tenant_id=$1) AS total_designations,
      (SELECT COUNT(*) FROM users WHERE tenant_id=$1 AND role='MANAGER') AS total_managers
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows[0];
};

// --------------------------------------------------------
// Last Logins
// --------------------------------------------------------
exports.getLastLogins = async (tenantId) => {
  const q = `
    SELECT 
      u.email,
      u.role,
      u.last_login_at,
      s.ip_address,
      s.user_agent,
      s.created_at AS session_created
    FROM users u
    LEFT JOIN user_sessions s ON s.user_id = u.id
    WHERE u.tenant_id=$1
    ORDER BY u.last_login_at DESC NULLS LAST
    LIMIT 20
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Recent Employees
// --------------------------------------------------------
exports.getRecentEmployees = async (tenantId) => {
  const q = `
    SELECT 
      u.email,
      u.role,
      e.first_name,
      e.last_name,
      u.created_at
    FROM users u
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.tenant_id=$1
    ORDER BY u.created_at DESC
    LIMIT 15
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Tenant Profile
// --------------------------------------------------------
exports.getTenantProfile = async (tenantId) => {
  const q = `
    SELECT id, name, domain, phone, email, address, city, state, country, zip_code, created_at
    FROM tenants
    WHERE id=$1
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows[0];
};

// --------------------------------------------------------
// Role Breakdown
// --------------------------------------------------------
exports.getRoleBreakdown = async (tenantId) => {
  const q = `
    SELECT role, COUNT(*) 
    FROM users 
    WHERE tenant_id=$1 
    GROUP BY role
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Department Counts
// --------------------------------------------------------
exports.getDepartmentCounts = async (tenantId) => {
  const q = `
    SELECT d.name AS department, COUNT(e.id) AS count
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id
    WHERE d.tenant_id=$1
    GROUP BY d.id
    ORDER BY d.name
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Designation Counts
// --------------------------------------------------------
exports.getDesignationCounts = async (tenantId) => {
  const q = `
    SELECT des.name AS designation, COUNT(e.id) AS count
    FROM designations des
    LEFT JOIN employees e ON e.designation_id = des.id
    WHERE des.tenant_id=$1
    GROUP BY des.id
    ORDER BY des.name
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Manager → Reports
// --------------------------------------------------------
exports.getManagerReports = async (tenantId) => {
  const q = `
    SELECT 
      m.id AS manager_id,
      um.email AS manager_email,
      em.first_name AS manager_first_name,
      em.last_name AS manager_last_name,
      COUNT(e.id) AS report_count
    FROM users um
    JOIN employees em ON em.user_id = um.id
    LEFT JOIN employees e ON e.reports_to = em.id
    WHERE um.tenant_id=$1 AND um.role='MANAGER'
    GROUP BY m.id, um.email, em.first_name, em.last_name
    ORDER BY report_count DESC
  `.replace("m.id", "em.id"); // fix alias
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Audit Logs
// --------------------------------------------------------
exports.getAuditLogs = async (tenantId) => {
  const q = `
    SELECT * 
    FROM audit_logs 
    WHERE tenant_id=$1
    ORDER BY created_at DESC
    LIMIT 50
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows;
};

// --------------------------------------------------------
// Employee Status Summary
// --------------------------------------------------------
exports.getEmployeeStatus = async (tenantId) => {
  const q = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE tenant_id=$1 AND is_active=true) AS active,
      (SELECT COUNT(*) FROM users WHERE tenant_id=$1 AND is_active=false) AS inactive
  `;
  const res = await pool.query(q, [tenantId]);
  return res.rows[0];
};
