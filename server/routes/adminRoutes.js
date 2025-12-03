const express = require("express");
const router = express.Router();
const {
  protect,
  superAdminOnly,
  adminAccess,
} = require("../middleware/authMiddleware");
const {
  adminSignup,
  adminLogin,
  approveAdmin,
  getPendingAdmins,
  disableUser,
  enableUser,
  getAllStudents,
  getPassoutStudents,
  getAllSubAdmins,
  deleteUser,
} = require("../controllers/adminController");

// Public
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// --- PROTECTED ROUTES ---
router.use(protect);

// 1. Shared Access (Super Admin & Sub Admin)
router.get("/all-students", adminAccess, getAllStudents); // Auto-filters by branch for Sub Admin
router.post("/disable-user", adminAccess, disableUser); // Auto-checks branch for Sub Admin
router.post("/enable-user", adminAccess, enableUser);

// 2. Super Admin Only
router.post("/approve-admin", superAdminOnly, approveAdmin);
router.get("/pending-admins", superAdminOnly, getPendingAdmins);
router.get("/sub-admins", superAdminOnly, getAllSubAdmins);
router.get("/passout-students", superAdminOnly, getPassoutStudents);
router.post("/delete-user", superAdminOnly, deleteUser);

module.exports = router;
