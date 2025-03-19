const express = require("express");
const {
  getGoogleAuth,
  signup,
  signin,
  getMe,
  logout,
  forgotPassword,
  changePassword,
  verifyForgotPasswordToken,
  verifyEmail,
  verifyEmailToken,
} = require("../Controllers/auth");
const router = express.Router();
router.route("/google").post(getGoogleAuth);

router.route("/changepassword").post(changePassword);

router.post("/signin", signin);

router.post("/logout", logout);

router.get("/me", getMe);

router.post("/signup", signup);

router.post("/forgotpassword", forgotPassword);

router.post("/verifyforgotpasswordtoken", verifyForgotPasswordToken);

router.post("/verifyemail", verifyEmail);

router.post("/verifyemailtoken", verifyEmailToken);

module.exports = router;
