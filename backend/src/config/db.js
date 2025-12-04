// src/config/db.js
const { Pool } = require('pg');
const env = require('./env');
const logger = require('./logger');

const asyncContext = require('../utils/asyncContext');

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    logger.error('Unexpected PG pool error', { err });
});

// Wrapper to set session variables
const originalConnect = pool.connect.bind(pool);
const originalQuery = pool.query.bind(pool);

pool.connect = async (...args) => {
    const client = await originalConnect(...args);
    const store = asyncContext.getStore();

    if (store) {
        try {
            const tenantId = store.get('tenantId');
            const userId = store.get('userId');
            const employeeId = store.get('employeeId');
            const role = store.get('role');

            const setters = [];
            const values = [];

            if (tenantId) {
                setters.push(`set_config('app.tenant_id', $${values.length + 1}, false)`);
                values.push(tenantId);
            }
            if (userId) {
                setters.push(`set_config('app.user_id', $${values.length + 1}, false)`);
                values.push(userId);
            }
            if (employeeId) {
                setters.push(`set_config('app.employee_id', $${values.length + 1}, false)`);
                values.push(employeeId);
            }
            if (role) {
                setters.push(`set_config('app.role', $${values.length + 1}, false)`);
                values.push(role);
            }

            if (setters.length > 0) {
                await client.query(`SELECT ${setters.join(', ')}`, values);
            }
        } catch (err) {
            logger.error('Error setting DB session variables', { err });
            // Don't release here, let the caller handle it or fail
        }
    }

    return client;
};

pool.query = async (text, params) => {
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
};

module.exports = pool;
