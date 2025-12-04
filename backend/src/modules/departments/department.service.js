const pool = require("../../config/db");
const asyncContext = require("../../utils/asyncContext");

const getQuery = (db) => {
  if (db && typeof db.query === "function") return db.query;
  return pool.query.bind(pool);
};

exports.createDepartment = async (db, data, actor) => {
  const query = getQuery(db);

  if (!["ADMIN", "HR"].includes(actor.role)) {
    throw new Error("Not allowed to create departments");
  }

  const tenantId = actor.tenantId;

  const res = await query(
    `
    INSERT INTO departments 
    (tenant_id, name, description, created_by)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [tenantId, data.name, data.description || null, actor.userId]
  );

  return res.rows[0];
};

exports.getDepartments = async (db, actor) => {
  const query = getQuery(db);

  const res = await query(
    `
    SELECT id, name, description, is_active, created_at
    FROM departments
    WHERE tenant_id = $1
    ORDER BY created_at DESC
    `,
    [actor.tenantId]
  );

  return res.rows;
};

exports.getDepartmentById = async (db, deptId, actor) => {
  const query = getQuery(db);

  const res = await query(
    `
    SELECT *
    FROM departments
    WHERE id = $1 AND tenant_id = $2
    `,
    [deptId, actor.tenantId]
  );

  return res.rows[0] || null;
};

exports.updateDepartment = async (db, deptId, updates, actor) => {
  const query = getQuery(db);

  if (!["ADMIN", "HR"].includes(actor.role)) {
    throw new Error("Not allowed to update departments");
  }

  const fields = [];
  const params = [];
  let idx = 1;

  for (const key of ["name", "description", "is_active"]) {
    if (updates[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      params.push(updates[key]);
    }
  }

  params.push(deptId);
  params.push(actor.tenantId);

  const sql = `
    UPDATE departments
    SET ${fields.join(", ")}, updated_at = now(), updated_by = '${actor.userId}'
    WHERE id = $${idx - 1} AND tenant_id = $${idx}
    RETURNING *
  `;

  const res = await query(sql, params);
  return res.rows[0];
};

exports.deleteDepartment = async (db, deptId, actor) => {
  const query = getQuery(db);

  if (!["ADMIN"].includes(actor.role)) {
    throw new Error("Only ADMIN can delete a department");
  }

  const res = await query(
    `
    DELETE FROM departments
    WHERE id = $1 AND tenant_id = $2
    RETURNING id
    `,
    [deptId, actor.tenantId]
  );

  return res.rows[0];
};
