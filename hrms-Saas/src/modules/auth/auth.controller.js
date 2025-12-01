const authService = require("./auth.service");
const logger = require("../../config/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../../config/db");
const env = require("../../config/env");
const mailer = require("../../config/mailer");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const userRes = await pool.query(
    `SELECT u.id, u.email, u.tenant_id, u.password_hash, u.role, u.employee_id, u.is_active
     FROM users u
     WHERE u.email = $1`,
    [email]
  );

  if (userRes.rowCount === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = userRes.rows[0];

  if (!user.is_active) {
    return res.status(401).json({ message: "Account is inactive" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.ip = req.ip;
  user.ua = req.headers["user-agent"];

  const tokens = await authService.generateTokens(user);
  return res.json({ status: "success", ...tokens });
};

exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  const session = await authService.verifyRefreshToken(refresh_token);
  if (!session) {
    return res.status(401).json({ message: "Session expired or invalid" });
  }

  const userRes = await pool.query(
    `SELECT id, tenant_id, email, role, employee_id
     FROM users u
     WHERE u.id = $1`,
    [session.user_id]
  );

  const user = userRes.rows[0];

  const newAccessToken = jwt.sign(
    {
      id: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      employeeId: user.employee_id,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  const newRefreshToken = crypto.randomBytes(48).toString("hex");

  await authService.updateSessionActivity(session.id, newRefreshToken);

  res.json({
    status: "success",
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

exports.logout = async (req, res) => {
  const { refresh_token } = req.body;
  await authService.revokeRefreshToken(refresh_token);
  res.json({ status: "success", message: "Logged out" });
};

exports.logoutAllOtherDevices = async (req, res) => {
  const authHeader = req.headers.authorization;
  const currentToken = authHeader?.split(" ")[1];

  const decoded = jwt.verify(currentToken, env.JWT_ACCESS_SECRET);

  await authService.revokeAllOtherSessions(decoded.id, req.body.refresh_token);

  res.json({ status: "success", message: "All other sessions logged out" });
};

exports.listActiveSessions = async (req, res) => {
  const userId = req.user.id;
  const sessions = await authService.listSessions(userId);
  res.json({ status: "success", sessions });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  await pool.query(
    `
      INSERT INTO password_resets (email, token, expires_at)
      VALUES ($1, $2, now() + interval '15 minutes')
    `,
    [email, token]
  );

  try {
    await mailer.sendPasswordResetEmail(email, token);
  } catch (error) {
    logger.error('Error sending password reset email:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    // Don't fail the request if email sending fails
  }

  res.json({ status: "success", message: "Password reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  logger.info('Reset password attempt:', { token: token.substring(0, 10) + '...' });

  // First, verify the token exists and is not expired
  const tokenRow = await pool.query(
    `SELECT email FROM password_resets WHERE token=$1 AND expires_at > now()`,
    [token]
  );

  if (tokenRow.rowCount === 0) {
    logger.error('Token not found or expired:', { token: token.substring(0, 10) + '...' });
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const email = tokenRow.rows[0].email;
  logger.info('Found reset token for email:', { email });
  
  try {
    // Hash the new password
    const hash = await bcrypt.hash(password, 10);

    logger.info('Attempting to update password for:', { email });
    
    // Update the user's password - RLS policy allows this because token exists
    const updateRes = await pool.query(
      `UPDATE users SET password_hash=$1, updated_at=now() WHERE email=$2 RETURNING id`,
      [hash, email]
    );

    logger.info('Update result:', { rowCount: updateRes.rowCount, email });

    if (updateRes.rowCount === 0) {
      logger.error('User not found in database:', { email });
      return res.status(400).json({ message: "User not found" });
    }

    // Delete the reset token to prevent reuse
    await pool.query(`DELETE FROM password_resets WHERE token=$1`, [token]);

    logger.info('✅ Password reset successful for email:', email);
    res.json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    logger.error('❌ Error resetting password:', {
      message: error.message,
      code: error.code,
      email,
      stack: error.stack
    });
    res.status(500).json({ status: "error", message: "Error resetting password" });
  }
};
