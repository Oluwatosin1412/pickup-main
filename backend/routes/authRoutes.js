<<<<<<< HEAD
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

=======
const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

>>>>>>> a1195d3d6afe14f5c61be8751076f62c0cf81414
module.exports = router;