
const pool = require('../config/db');
const { UnauthorizedError } = require('../utils/customErrors');

module.exports = function setRLSContext() {
    return async function (req, res, next) {
        if (!req.user) {
            return next(new UnauthorizedError('Missing user in request context'));
        }

        const { tenantId, userId, employeeId, role } = req.user;

        const client = await pool.connect();

        try {
            // set session GUCs for RLS
            await client.query(`SET app.tenant_id = ${tenantId ? `'${tenantId}'` : 'NULL'}`);
            await client.query(`SET app.user_id = ${userId ? `'${userId}'` : 'NULL'}`);
            await client.query(`SET app.employee_id = ${employeeId ? `'${employeeId}'` : 'NULL'}`);
            await client.query(`SET app.role = ${role ? `'${role}'` : 'NULL'}`);

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
