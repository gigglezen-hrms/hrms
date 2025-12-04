const { Pool } = require("pg");
const asyncContext = require("../utils/asyncContext");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Add RLS per-query setup
async function query(sql, params) {
  const ctx = asyncContext.getStore();

  const client = await pool.connect();
  try {
    if (ctx) {
      const tenantId = ctx.get("tenantId");
      const role = ctx.get("role");
      const userId = ctx.get("userId");
      const employeeId = ctx.get("employeeId");

if (role === 'SUPER_ADMIN') {
    await client.query(`SET app.tenant_id = NULL`);
    await client.query(`SET app.role = 'SUPER_ADMIN'`);
} else {
    await client.query(`SET app.tenant_id = '${tenantId}'`);
    await client.query(`SET app.role = '${role}'`);
}

      await client.query(`SET app.user_id = '${userId || "NULL"}';`);
      await client.query(`SET app.employee_id = ${employeeId ? `'${employeeId}'` : "NULL"};`);
    }

    const result = await client.query(sql, params);
    return result;
  } finally {
    await client.query("RESET ALL;");
    client.release();
  }
}

module.exports = { query, pool };
