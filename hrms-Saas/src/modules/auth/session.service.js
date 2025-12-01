// src/modules/auth/session.service.js
const pool = require('../../config/db');
const logger = require('../../config/logger');

/**
 * Get all active sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of active sessions
 */
exports.getActiveSessions = async (userId) => {
    const result = await pool.query(
        `SELECT id, refresh_token, user_agent, ip_address, expires_at, created_at
         FROM user_sessions
         WHERE user_id = $1 
           AND is_revoked = false 
           AND expires_at > NOW()
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

/**
 * Get session by refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Objectnull>} Session object or null
 */
exports.getSessionByToken = async (refreshToken) => {
    const result = await pool.query(
        `SELECT id, user_id, tenant_id, refresh_token, user_agent, ip_address, 
                is_revoked, expires_at, created_at
         FROM user_sessions
         WHERE refresh_token = $1`,
        [refreshToken]
    );

    return result.rowCount > 0 ? result.rows[0] : null;
};

/**
 * Create a new session
 * @param {Object} sessionData - Session data
 * @returns {Promise<Object>} Created session
 */
exports.createSession = async (sessionData) => {
    const { userId, tenantId, refreshToken, userAgent, ipAddress, expiresAt } = sessionData;

    const result = await pool.query(
        `INSERT INTO user_sessions 
         (user_id, tenant_id, refresh_token, user_agent, ip_address, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, tenantId, refreshToken, userAgent, ipAddress, expiresAt]
    );

    return result.rows[0];
};

/**
 * Update session refresh token
 * @param {string} sessionId - Session ID
 * @param {string} newRefreshToken - New refresh token
 * @returns {Promise<Object>} Updated session
 */
exports.updateSessionToken = async (sessionId, newRefreshToken) => {
    const result = await pool.query(
        `UPDATE user_sessions
         SET refresh_token = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [newRefreshToken, sessionId]
    );

    return result.rows[0];
};

/**
 * Revoke a specific session
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} True if revoked successfully
 */
exports.revokeSession = async (sessionId) => {
    const result = await pool.query(
        `UPDATE user_sessions
         SET is_revoked = true, updated_at = NOW()
         WHERE id = $1`,
        [sessionId]
    );

    return result.rowCount > 0;
};

/**
 * Revoke session by refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>} True if revoked successfully
 */
exports.revokeSessionByToken = async (refreshToken) => {
    const result = await pool.query(
        `UPDATE user_sessions
         SET is_revoked = true, updated_at = NOW()
         WHERE refresh_token = $1`,
        [refreshToken]
    );

    return result.rowCount > 0;
};

/**
 * Revoke all sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of sessions revoked
 */
exports.revokeAllUserSessions = async (userId) => {
    const result = await pool.query(
        `UPDATE user_sessions
         SET is_revoked = true, updated_at = NOW()
         WHERE user_id = $1 AND is_revoked = false`,
        [userId]
    );

    return result.rowCount;
};

/**
 * Revoke all sessions except the current one
 * @param {string} userId - User ID
 * @param {string} currentSessionId - Current session ID to keep
 * @returns {Promise<number>} Number of sessions revoked
 */
exports.revokeOtherSessions = async (userId, currentSessionId) => {
    const result = await pool.query(
        `UPDATE user_sessions
         SET is_revoked = true, updated_at = NOW()
         WHERE user_id = $1 AND id != $2 AND is_revoked = false`,
        [userId, currentSessionId]
    );

    return result.rowCount;
};

/**
 * Clean up expired sessions
 * Removes sessions that have expired
 * @returns {Promise<number>} Number of sessions cleaned up
 */
exports.cleanupExpiredSessions = async () => {
    try {
        const result = await pool.query(
            `DELETE FROM user_sessions
             WHERE expires_at < NOW() OR is_revoked = true`,
        );

        logger.info(`Cleaned up ${result.rowCount} expired/revoked sessions`);
        return result.rowCount;
    } catch (error) {
        logger.error('Error cleaning up expired sessions:', error);
        throw error;
    }
};

/**
 * Get session count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of active sessions
 */
exports.getSessionCount = async (userId) => {
    const result = await pool.query(
        `SELECT COUNT(*) as count
         FROM user_sessions
         WHERE user_id = $1 
           AND is_revoked = false 
           AND expires_at > NOW()`,
        [userId]
    );

    return parseInt(result.rows[0].count, 10);
};

/**
 * Check if session is valid
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>} True if session is valid
 */
exports.isSessionValid = async (refreshToken) => {
    const result = await pool.query(
        `SELECT EXISTS(
            SELECT 1
            FROM user_sessions
            WHERE refresh_token = $1
              AND is_revoked = false
              AND expires_at > NOW()
        ) as is_valid`,
        [refreshToken]
    );

    return result.rows[0]?.is_valid || false;
};
