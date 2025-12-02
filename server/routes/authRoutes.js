const express = require("express");
const router = express.Router();
const {
  signup,
  verifyOTP,
  login,
  logout,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
