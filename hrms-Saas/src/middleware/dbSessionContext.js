const asyncContext = require('../utils/asyncContext');

/**
 * Middleware to initialize database session context
 * Must be used AFTER authentication middleware (verifyJwt)
 */
const dbSessionContext = (req, res, next) => {
    const store = new Map();

    if (req.user) {
        if (req.user.tenantId) store.set('tenantId', req.user.tenantId);
        if (req.user.userId) store.set('userId', req.user.userId);
        if (req.user.employeeId) store.set('employeeId', req.user.employeeId);
        if (req.user.role) store.set('role', req.user.role);
    }

    asyncContext.run(store, () => {
        next();
    });
};

module.exports = dbSessionContext;
