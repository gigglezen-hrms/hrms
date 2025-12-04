const pool = require('../config/db');
const { UnauthorizedError } = require('../utils/customErrors');
const asyncContext = require('../utils/asyncContext');

module.exports = function setRLSContext() {
    return async function (req, res, next) {
        if (!req.user) {
            return next(new UnauthorizedError('Missing user in request context'));
        }

        const { tenantId, userId, employeeId, role } = req.user;

        
        try {
            const store = new Map();
            if (tenantId) store.set('tenantId', tenantId);
            if (userId) store.set('userId', userId);
            if (employeeId) store.set('employeeId', employeeId);
            if (role) store.set('role', role);

            
            asyncContext.enterWith(store);
        } catch (e) {
        }

        const client = await pool.connect();

        try {
            
            if (tenantId) {
                await client.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantId]);
            } else {
                await client.query(`RESET app.tenant_id`);
            }

            if (userId) {
                await client.query(`SELECT set_config('app.user_id', $1, true)`, [userId]);
            } else {
                await client.query(`RESET app.user_id`);
            }

            if (employeeId) {
                await client.query(`SELECT set_config('app.employee_id', $1, true)`, [employeeId]);
            } else {
                await client.query(`RESET app.employee_id`);
            }

            if (role) {
                await client.query(`SELECT set_config('app.role', $1, true)`, [role]);
            } else {
                await client.query(`RESET app.role`);
            }

            req.db = client;

            res.on('finish', () => client.release());
            res.on('error', () => client.release());

            next();
        } catch (err) {
            client.release();
            next(err);
        }
    };
};
