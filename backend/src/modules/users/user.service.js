const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../config/mailer");
const logger = require("../../config/logger");

const getQuery = (db) =>
  db && typeof db.query === "function" ? db.query : pool.query.bind(pool);

/* ----------------------------- CREATE USER ----------------------------- */
exports.createUser = async (db, data, actor) => {
  const query = getQuery(db);

  if (!["ADMIN", "HR"].includes(actor.role)) {
    throw new Error("Not allowed to create users");
  }

  if (actor.role === "HR" && data.role === "HR") {
    throw new Error("HR cannot create another HR user");
  }

  if (data.role === "ADMIN") {
    throw new Error("ADMIN role creation allowed only for SUPER_ADMIN");
  }

  const duplicate = await query(
    `SELECT id FROM users WHERE tenant_id=$1 AND email=$2`,
    [actor.tenantId, data.email]
  );

  if (duplicate.rowCount) throw new Error("Email already exists");

  const tempPassword = crypto.randomBytes(6).toString("hex");
  const hash = await bcrypt.hash(tempPassword, 10);

  const userRes = await query(
    `
    INSERT INTO users 
      (tenant_id, email, password_hash, role, is_active, must_change_password, created_by)
    VALUES ($1,$2,$3,$4,true,true,$5)
    RETURNING id, email, role
    `,
    [actor.tenantId, data.email, hash, data.role, actor.id]
  );

  const empRes = await query(
    `
    INSERT INTO employees
      (tenant_id, user_id, first_name, last_name, phone, department_id, designation_id, reports_to, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id
    `,
    [
      actor.tenantId,
      userRes.rows[0].id,
      data.first_name,
      data.last_name || null,
      data.phone || null,
      data.department_id || null,
      data.designation_id || null,
      data.reports_to || null,
      actor.id
    ]
  );

  try {
    await mailer.sendUserWelcome(
      userRes.rows[0].email,
      data.first_name,
      tempPassword
    );
  } catch (err) {
    logger.error("Email sending error:", err);
  }

  return {
    user: userRes.rows[0],
    employee: empRes.rows[0]
  };
};

/* -------------------------- LIST USERS -------------------------- */
exports.getUsers = async (db, opts, actor) => {
  const query = getQuery(db);

  const filter = [];
  const params = [];
  let i = 1;

  if (opts.role) {
    filter.push(`u.role = $${i}`);
    params.push(opts.role);
    i++;
  }

  if (opts.search) {
    filter.push(`(u.email ILIKE $${i} OR e.first_name ILIKE $${i})`);
    params.push(`%${opts.search}%`);
    i++;
  }

  const where = filter.length ? "AND " + filter.join(" AND ") : "";

  const sql = `
    SELECT u.*, e.first_name, e.last_name, e.department_id, e.designation_id
    FROM users u
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.tenant_id = $${i}
    ${where}
    ORDER BY u.created_at DESC
  `;

  params.push(actor.tenantId);

  const rows = await query(sql, params);
  return rows.rows;
};

/* ------------------------- GET ONE USER ------------------------- */
exports.getUserById = async (db, id) => {
  const query = getQuery(db);
  const res = await query(
    `
    SELECT u.*, e.first_name, e.last_name, e.phone, e.department_id, e.designation_id, e.reports_to
    FROM users u 
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.id=$1
    `,
    [id]
  );

  return res.rows[0] || null;
};

/* ---------------------- EMPLOYEE PROFILE UPDATE ---------------------- */
exports.updateEmployee = async (db, id, updates) => {
  const query = getQuery(db);

  const allowed = [
    "first_name",
    "last_name",
    "phone",
    "department_id",
    "designation_id",
    "reports_to"
  ];

  const fields = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      fields.push(`${key}=$${i}`);
      params.push(updates[key]);
      i++;
    }
  }

  params.push(id);

  const sql = `
    UPDATE employees 
    SET ${fields.join(", ")}, updated_at=now()
    WHERE user_id=$${i}
    RETURNING *
  `;

  const result = await query(sql, params);
  return result.rows[0];
};

/* ---------------------------- ESS: MY PROFILE ---------------------------- */
exports.getMyProfile = async (db, user) => {
  const query = getQuery(db);
  const res = await query(
    `
    SELECT u.*, e.first_name, e.last_name, e.phone, e.department_id, e.designation_id
    FROM users u 
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.id=$1
    `,
    [user.id]
  );

  return res.rows[0];
};

exports.updateMyProfile = async (db, user, updates) => {
  return this.updateEmployee(db, user.id, updates);
};

/* ---------------------------- MANAGER MODULE ----------------------------- */
exports.getManagerDashboard = async (db, user) => {
  const query = getQuery(db);
  const res = await query(
    `
    SELECT 
      COUNT(*) FILTER (WHERE reports_to = $1) AS direct_reports,
      COUNT(*) AS total_employees
    FROM employees 
    WHERE tenant_id = $2
    `,
    [user.employeeId, user.tenantId]
  );

  return res.rows[0];
};

exports.getDirectReports = async (db, user) => {
  const query = getQuery(db);
  const res = await query(
    `
    SELECT u.id, u.email, e.first_name, e.last_name, e.department_id
    FROM employees e
    JOIN users u ON u.id = e.user_id
    WHERE e.reports_to = $1
    `,
    [user.employeeId]
  );

  return res.rows;
};

/* ---------------------- UPDATE USER STATUS ---------------------- */
exports.updateUserStatus = async (db, id, isActive, actor) => {
  const query = getQuery(db);
  const res = await query(
    `UPDATE users SET is_active=$1, updated_at=now() WHERE id=$2 RETURNING *`,
    [isActive, id]
  );
  return res.rows[0];
};

exports.deactivateUser = async (db, id, actor) => {
  return this.updateUserStatus(db, id, false, actor);
};

exports.activateUser = async (db, id, actor) => {
  return this.updateUserStatus(db, id, true, actor);
};

/* ---------------------- UPDATE USER EMAIL ---------------------- */
exports.updateUser = async (db, id, updates, actor) => {
  const query = getQuery(db);
  const allowed = ["email", "is_active"];
  const fields = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      fields.push(`${key}=$${i}`);
      params.push(updates[key]);
      i++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  params.push(id);

  const sql = `
    UPDATE users 
    SET ${fields.join(", ")}, updated_at=now()
    WHERE id=$${i}
    RETURNING *
  `;

  const result = await query(sql, params);
  return result.rows[0];
};

/* ---------------------- ROLE & ASSIGNMENT UPDATES ---------------------- */
exports.changeRole = async (db, id, newRole, actor) => {
  const query = getQuery(db);
  const res = await query(
    `UPDATE users SET role=$1, updated_at=now() WHERE id=$2 RETURNING *`,
    [newRole, id]
  );
  return res.rows[0];
};

exports.changeManager = async (db, id, managerEmployeeId, actor) => {
  const query = getQuery(db);
  const res = await query(
    `UPDATE employees SET reports_to=$1, updated_at=now() WHERE user_id=$2 RETURNING *`,
    [managerEmployeeId, id]
  );
  return res.rows[0];
};

exports.assignDepartment = async (db, id, departmentId, actor) => {
  const query = getQuery(db);
  const res = await query(
    `UPDATE employees SET department_id=$1, updated_at=now() WHERE user_id=$2 RETURNING *`,
    [departmentId, id]
  );
  return res.rows[0];
};

exports.assignDesignation = async (db, id, designationId, actor) => {
  const query = getQuery(db);
  const res = await query(
    `UPDATE employees SET designation_id=$1, updated_at=now() WHERE user_id=$2 RETURNING *`,
    [designationId, id]
  );
  return res.rows[0];
};
