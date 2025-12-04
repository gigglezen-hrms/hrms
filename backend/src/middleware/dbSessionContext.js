const asyncContext = require('../utils/asyncContext');

const dbSessionContext = (req, res, next) => {
    const store = new Map();

    if (req.user) {
        // SUPER ADMIN (tenant-less global access)
        if (req.user.role === "SUPER_ADMIN") {
            store.set("tenantId", null);
            store.set("role", "SUPER_ADMIN");
        } else {
            // Regular tenant users
            store.set("tenantId", req.user.tenantId);
            store.set("role", req.user.role);

            if (req.user.userId) store.set("userId", req.user.userId);
            if (req.user.employeeId) store.set("employeeId", req.user.employeeId);
        }
    }

    asyncContext.run(store, () => {
        next();
    });
};

module.exports = dbSessionContext;
