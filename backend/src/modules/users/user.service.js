const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../config/mailer");
const logger = require("../../config/logger");

/** Uses req.db.query if available, else pool.query */
const getQuery = (db) => {
  if (db && typeof db.query === "function") return db.query;
  return pool.query.bind(pool);
};

/**
 * CREATE USER (ADMIN + HR)
 */
exports.createUser = async (db, data, creator) => {
  const query = getQuery(db);

  if (!creator || !creator.tenantId) {
    throw new Error("Invalid creator context");
  }

  const tenantId = creator.tenantId;

  /** ROLE RULES */
  if (!["ADMIN", "HR"].includes(creator.role)) {
    throw new Error("Not allowed to create users");
  }
  if (creator.role === "HR" && data.role === "HR") {
    throw new Error("HR cannot create another HR");
  }
  if (data.role === "ADMIN") {
    throw new Error("ADMIN creation is allowed only by SUPER_ADMIN");
  }

  /** Duplicate email check — emails unique per tenant */
  const dup = await query(
    `SELECT id FROM users WHERE tenant_id = $1 AND email = $2 LIMIT 1`,
    [tenantId, data.email]
  );
  if (dup.rowCount > 0) {
    throw new Error("User with this email already exists in tenant");
  }

  const tempPassword = crypto.randomBytes(6).toString("hex");
  const hash = await bcrypt.hash(tempPassword, 10);

  const client = db?.client || null;
  const trx = client || (await pool.connect());

  try {
    await trx.query("BEGIN");

    /** Insert User */
    const userRes = await trx.query(
      `
      INSERT INTO users
        (tenant_id, email, password_hash, role, is_active, must_change_password, created_by)
      VALUES ($1,$2,$3,$4,true,true,$5)
      RETURNING id, email, role
      `,
      [tenantId, data.email, hash, data.role, creator.id]
    );

    const user = userRes.rows[0];

    /** Insert Employee Profile */
    const empRes = await trx.query(
      `
      INSERT INTO employees
        (tenant_id, user_id, first_name, last_name, phone, department_id, designation_id, reports_to, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, first_name, last_name
      `,
      [
        tenantId,
        user.id,
        data.first_name,
        data.last_name || null,
        data.phone || null,
        data.department_id || null,
        data.designation_id || null,
        data.reports_to || null,
        creator.id
      ]
    );

    const employee = empRes.rows[0];

    await trx.query("COMMIT");

    /** Send temp password email */
    try {
      await mailer.sendUserWelcome(user.email, data.first_name || "User", tempPassword);
    } catch (err) {
      logger.error("Failed to send welcome email:", err);
    }

    return { user, employee };
  } catch (err) {
    await trx.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    if (!client) trx.release();
  }
};

/**
 * LIST USERS
 */
exports.getUsers = async (db, opts) => {
  const query = getQuery(db);

  const filters = [];
  const params = [];
  let i = 1;

  if (opts.role) {
    filters.push(`u.role = $${i++}`);
    params.push(opts.role);
  }
  if (opts.departmentId) {
    filters.push(`e.department_id = $${i++}`);
    params.push(opts.departmentId);
  }
  if (opts.search) {
    filters.push(`(u.email ILIKE $${i} OR e.first_name ILIKE $${i} OR e.last_name ILIKE $${i})`);
    params.push(`%${opts.search}%`);
    i++;
  }

  const where = filters.length ? `AND ${filters.join(" AND ")}` : "";

  const limit = opts.limit ? Number(opts.limit) : 50;
  const offset = opts.offset ? Number(opts.offset) : 0;

  const sql = `
    SELECT u.id, u.email, u.role, u.is_active, u.created_at,
           e.id AS employee_id, e.first_name, e.last_name,
           e.department_id, e.designation_id, e.reports_to
    FROM users u
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE 1=1
    ${where}
    ORDER BY u.created_at DESC
    LIMIT $${i++} OFFSET $${i++}
  `;

  params.push(limit, offset);

  const res = await query(sql, params);
  return res.rows;
};

/**
 * GET ONE USER
 */
exports.getUserById = async (db, userId) => {
  const query = getQuery(db);
  const res = await query(
    `
    SELECT u.*, e.id AS employee_id, e.first_name, e.last_name, e.phone,
           e.department_id, e.designation_id, e.reports_to
    FROM users u
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.id = $1
    `,
    [userId]
  );

  return res.rows[0] || null;
};

/**
 * UPDATE USER BASIC DETAILS (email, is_active)
 */
exports.updateUser = async (db, userId, updates, actor) => {
  const query = getQuery(db);

  // HR cannot touch ADMIN
  if (actor.role === "HR") {
    const target = await query(`SELECT role FROM users WHERE id=$1`, [userId]);
    if (target.rows[0]?.role === "ADMIN") throw new Error("HR cannot update ADMIN");
  }

  const allowed = ["email", "is_active"];
  const fields = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (key in updates) {
      fields.push(`${key} = $${i++}`);
      params.push(updates[key]);
    }
  }

  if (!fields.length) return null;

  params.push(userId);

  const sql = `
    UPDATE users SET ${fields.join(", ")}, updated_at = now()
    WHERE id = $${i}
    RETURNING id, email, role, is_active
  `;

  const res = await query(sql, params);
  return res.rows[0];
};

/**
 * UPDATE EMPLOYEE PROFILE
 */
exports.updateEmployee = async (db, userId, updates, actor) => {
  const query = getQuery(db);

  const allowed = ["first_name","last_name","phone","department_id","designation_id","reports_to"];
  const fields = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (key in updates) {
      fields.push(`${key} = $${i++}`);
      params.push(updates[key]);
    }
  }

  params.push(userId);

  const sql = `
    UPDATE employees SET ${fields.join(", ")}, updated_at = now()
    WHERE user_id = $${i}
    RETURNING *
  `;

  const res = await query(sql, params);
  return res.rows[0];
};

/**
 * ACTIVATE / DEACTIVATE USER
 */
exports.deactivateUser = async (db, userId, actor) => {
  const query = getQuery(db);

  if (actor.id === userId) throw new Error("Cannot deactivate your own account");

  if (actor.role === "HR") {
    const target = await query(`SELECT role FROM users WHERE id=$1`, [userId]);
    if (target.rows[0]?.role === "ADMIN") throw new Error("HR cannot deactivate ADMIN");
  }

  const res = await query(
    `UPDATE users SET is_active=false, updated_at=now() WHERE id=$1 RETURNING id, is_active`,
    [userId]
  );

  return res.rows[0];
};

exports.activateUser = async (db, userId, actor) => {
  const query = getQuery(db);

  const res = await query(
    `UPDATE users SET is_active=true, updated_at=now() WHERE id=$1 RETURNING id, is_active`,
    [userId]
  );

  return res.rows[0];
};

/**
 * RESET PASSWORD (ADMIN/HR)
 */
exports.resetPasswordAdmin = async (db, userId, actor) => {
  const query = getQuery(db);

  if (!["ADMIN","HR","SUPER_ADMIN"].includes(actor.role))
    throw new Error("Not allowed");

  if (actor.role === "HR") {
    const target = await query(`SELECT role FROM users WHERE id=$1`, [userId]);
    if (target.rows[0]?.role === "ADMIN") throw new Error("HR cannot reset ADMIN password");
  }

  const temp = crypto.randomBytes(6).toString("hex");
  const hash = await bcrypt.hash(temp, 10);

  await query(
    `UPDATE users SET password_hash=$1, must_change_password=true, updated_at=now() WHERE id=$2`,
    [hash, userId]
  );

  const row = await query(`SELECT email FROM users WHERE id=$1`, [userId]);
  const email = row.rows[0]?.email;

  try {
    await mailer.sendUserWelcome(email, "", temp);
  } catch (err) {
    logger.error("Failed to send reset password email:", err);
  }

  return { tempPasswordSent: true };
};

/**
 * CHANGE ROLE
 */
exports.changeRole = async (db, userId, newRole, actor) => {
  const query = getQuery(db);

  if (!["ADMIN","SUPER_ADMIN"].includes(actor.role)) {
    throw new Error("Not allowed to change roles");
  }

  if (actor.role === "ADMIN" && newRole === "ADMIN") {
    throw new Error("ADMIN cannot assign ADMIN role");
  }

  const res = await query(
    `UPDATE users SET role=$1, updated_at=now() WHERE id=$2 RETURNING id, role`,
    [newRole, userId]
  );

  return res.rows[0];
};

/**
 * CHANGE MANAGER (reporting)
 */
exports.changeManager = async (db, userId, managerEmployeeId, actor) => {
  const query = getQuery(db);

  if (!["ADMIN","HR","SUPER_ADMIN"].includes(actor.role)) {
    throw new Error("Not allowed");
  }

  const res = await query(
    `UPDATE employees SET reports_to=$1, updated_at=now() WHERE user_id=$2 RETURNING *`,
    [managerEmployeeId, userId]
  );

  return res.rows[0];
};

/**
 * ASSIGN DEPARTMENT
 */
exports.assignDepartment = async (db, userId, departmentId, actor) => {
  const query = getQuery(db);

  if (!["ADMIN","HR","SUPER_ADMIN"].includes(actor.role))
    throw new Error("Not allowed");

  const res = await query(
    `UPDATE employees SET department_id=$1, updated_at=now() WHERE user_id=$2 RETURNING *`,
    [departmentId, userId]
  );

  return res.rows[0];
};

/**
 * ASSIGN DESIGNATION
 */
exports.assignDesignation = async (db, userId, designationId, actor) => {
  const query = getQuery(db);

  if (!["ADMIN","HR","SUPER_ADMIN"].includes(actor.role))
    throw new Error("Not allowed");

  const res = await query(
    `UPDATE employees SET designation_id=$1, updated_at=now() WHERE user_id=$2 RETURNING *`,
    [designationId, userId]
  );

  return res.rows[0];
};
