
const { ForbiddenError } = require('../utils/customErrors');

module.exports = function requireRole(allowedRoles = []) {
    return function (req, res, next) {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
};
