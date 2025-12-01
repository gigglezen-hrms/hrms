const express = require("express");
const router = express.Router();

const controller = require("./auth.controller");
const validate = require("../../middleware/validate");
const {
    loginSchema,
    refreshSchema,
    forgotSchema,
    resetSchema,
    logoutSchema
} = require("./auth.validator.js");

const authenticate = require("../../middleware/verifyJwt");

router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh-token", validate(refreshSchema), controller.refreshToken);
router.post("/logout", validate(logoutSchema), controller.logout);
router.post("/logout-all", authenticate, controller.logoutAllOtherDevices);

router.post("/forgot-password", validate(forgotSchema), controller.forgotPassword);
router.post("/reset-password", validate(resetSchema), controller.resetPassword);

router.get("/sessions", authenticate, controller.listActiveSessions);

module.exports = router;
