const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  adminSignup,
  adminLogin,
  approveAdmin,
  getPendingAdmins,
  disableUser,
  enableUser,
  getAllStudents,
} = require("../controllers/adminController");

// Public Routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// Protected Routes (Require Token + Admin Role)
router.use(protect);
router.use(adminOnly);

router.post("/approve-admin", approveAdmin);
router.get("/pending-admins", getPendingAdmins);
router.post("/disable-user", disableUser);
router.post("/enable-user", enableUser);
router.get("/all-students", getAllStudents); // Used by Students Tab

module.exports = router;
