const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../../config/db");
const logger = require("../../config/logger");
const env = require("../../config/env");

const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "7", 10);
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT_MINUTES || "30", 10);

exports.generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      employeeId: user.employee_id,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  const refreshToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

  const client = await pool.connect();
  await client.query(
    `
      INSERT INTO user_sessions 
      (tenant_id, user_id, refresh_token, expires_at, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      user.tenant_id || null,
      user.id,
      refreshToken,
      expiresAt,
      user.ip || null,
      user.ua || null
    ]
  );
  client.release();

  return { accessToken, refreshToken };
};

exports.verifyRefreshToken = async (refreshToken) => {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, user_id, expires_at, is_revoked, created_at 
      FROM user_sessions 
      WHERE refresh_token = $1
    `, [refreshToken]);

    if (res.rowCount === 0) return null;
    const row = res.rows[0];

    if (row.is_revoked) return null;
    if (new Date(row.expires_at) < new Date()) return null;

    return row;
  } finally {
    client.release();
  }
};

exports.updateSessionActivity = async (sessionId, newToken) => {
  await pool.query(
    `
      UPDATE user_sessions
      SET refresh_token=$1, updated_at=now()
      WHERE id=$2
    `,
    [newToken, sessionId]
  );
};

exports.revokeRefreshToken = async (token) => {
  await pool.query(
    `UPDATE user_sessions SET is_revoked = true WHERE refresh_token=$1`,
    [token]
  );
};

exports.revokeAllOtherSessions = async (userId, exceptToken) => {
  await pool.query(
    `
      UPDATE user_sessions 
      SET is_revoked = true 
      WHERE user_id=$1 AND refresh_token <> $2
    `,
    [userId, exceptToken]
  );
};

exports.listSessions = async (userId) => {
  const res = await pool.query(
    `
      SELECT id, refresh_token as token, created_at, expires_at, ip_address, user_agent, is_revoked
      FROM user_sessions
      WHERE user_id=$1
      ORDER BY created_at DESC
    `,
    [userId]
  );
  return res.rows;
};

