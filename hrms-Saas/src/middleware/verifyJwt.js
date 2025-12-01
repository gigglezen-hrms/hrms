// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../utils/customErrors');

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Missing or invalid Authorization header'));
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

        req.user = {
            userId: payload.user_id,
            tenantId: payload.tenant_id,
            employeeId: payload.employee_id || null,
            role: payload.role
        };

        next();
    } catch (err) {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};
