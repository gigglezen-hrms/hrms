const { Pool } = require("pg");
const env = require("./env");
const logger = require("./logger");
const asyncContext = require("../utils/asyncContext");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
  logger.error("Unexpected PG pool error", { err });
});

// --------- RLS SESSION WRAPPER ---------
async function withContext(client) {
  const store = asyncContext.getStore();
  if (!store) return;

  const tenantId = store.get("tenantId");
  const userId = store.get("userId");
  const employeeId = store.get("employeeId");
  const role = store.get("role");

  // SUPER ADMIN bypasses tenant isolation
  if (role === "SUPER_ADMIN") {
    await client.query(`SET app.role = 'SUPER_ADMIN'`);
    await client.query(`SET app.tenant_id = NULL`);
  } else {
    await client.query(`SET app.role = '${role}'`);
    await client.query(`SET app.tenant_id = '${tenantId}'`);
  }

  await client.query(`SET app.user_id = '${userId || null}'`);
  await client.query(`SET app.employee_id = '${employeeId || null}'`);
}

// --------- OVERRIDE pool.query ---------
pool.query = async (text, params) => {
  const client = await pool.connect();
  try {
    await withContext(client);
    return await client.query(text, params);
  } finally {
    await client.query("RESET ALL");
    client.release();
  }
};

// --------- OVERRIDE pool.connect ---------
const originalConnect = pool.connect.bind(pool);

pool.connect = async (...args) => {
  const client = await originalConnect(...args);
  await withContext(client);
  return client;
};

module.exports = pool;
