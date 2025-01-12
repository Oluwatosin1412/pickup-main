const express = require("express");
const { register, registerOrganization, login, loginOrganization, refreshToken, forgotPassword, resetPassword, requestPasswordReset, requestPasswordResetOrg, resetPasswordOrg } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/register-organization", registerOrganization);
router.post("/login", login);
router.post("/login-organization", loginOrganization);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/request-password-reset-org", requestPasswordResetOrg);
router.post("/reset-password-org/:userID/:token/:tokenID", resetPasswordOrg);

module.exports = router;