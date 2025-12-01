// src/modules/auth/permission.service.js
const pool = require('../../config/db');

/**
 * Get all permissions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array<string>>} Array of permission codes
 */
exports.getUserPermissions = async (userId) => {
    const result = await pool.query(
        `SELECT DISTINCT p.code
         FROM permissions p
         INNER JOIN role_permissions rp ON p.id = rp.permission_id
         INNER JOIN roles r ON rp.role_id = r.id
         INNER JOIN users u ON u.role = r.code
         WHERE u.id = $1`,
        [userId]
    );

    return result.rows.map(row => row.code);
};
/**
 * Get all permissions for a role
 * @param {string} roleCode - Role code (e.g., 'ADMIN', 'HR', 'MANAGER')
 * @returns {Promise<Array<string>>} Array of permission codes
 */
exports.getRolePermissions = async (roleCode) => {
    const result = await pool.query(
        `SELECT DISTINCT p.code
         FROM permissions p
         INNER JOIN role_permissions rp ON p.id = rp.permission_id
         INNER JOIN roles r ON rp.role_id = r.id
         WHERE r.code = $1`,
        [roleCode]
    );

    return result.rows.map(row => row.code);
};

/**
 * Check if a user has a specific permission
 * @param {string} userId - User ID
 * @param {string} permissionCode - Permission code to check
 * @returns {Promise<boolean>} True if user has permission
 */
exports.hasPermission = async (userId, permissionCode) => {
    const result = await pool.query(
        `SELECT EXISTS(
            SELECT 1
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            INNER JOIN roles r ON rp.role_id = r.id
            INNER JOIN users u ON u.role = r.code
            WHERE u.id = $1 AND p.code = $2
        ) as has_permission`,
        [userId, permissionCode]
    );

    return result.rows[0]?.has_permission || false;
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} userId - User ID
 * @param {Array<string>} permissionCodes - Array of permission codes
 * @returns {Promise<boolean>} True if user has any of the permissions
 */
exports.hasAnyPermission = async (userId, permissionCodes) => {
    const result = await pool.query(
        `SELECT EXISTS(
            SELECT 1
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            INNER JOIN roles r ON rp.role_id = r.id
            INNER JOIN users u ON u.role = r.code
            WHERE u.id = $1 AND p.code = ANY($2)
        ) as has_permission`,
        [userId, permissionCodes]
    );

    return result.rows[0]?.has_permission || false;
};

/**
 * Check if a user has all of the specified permissions
 * @param {string} userId - User ID
 * @param {Array<string>} permissionCodes - Array of permission codes
 * @returns {Promise<boolean>} True if user has all permissions
 */
exports.hasAllPermissions = async (userId, permissionCodes) => {
    const permissions = await exports.getUserPermissions(userId);
    return permissionCodes.every(code => permissions.includes(code));
};

/**
 * Middleware to check permission
 * @param {string} permissionCode - Required permission code
 * @returns {Function} Express middleware
 */
exports.checkPermission = (permissionCode) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Super admin has all permissions
            if (req.user.role === 'SUPER_ADMIN') {
                return next();
            }

            const hasAccess = await exports.hasPermission(req.user.userId, permissionCode);

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param {Array<string>} permissionCodes - Array of permission codes
 * @returns {Function} Express middleware
 */
exports.checkAnyPermission = (permissionCodes) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Super admin has all permissions
            if (req.user.role === 'SUPER_ADMIN') {
                return next();
            }

            const hasAccess = await exports.hasAnyPermission(req.user.userId, permissionCodes);

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
