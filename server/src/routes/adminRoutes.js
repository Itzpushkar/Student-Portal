const express = require("express");
const router = express.Router();
const {
  protect,
  superAdminOnly,
  adminAccess,
} = require("../middleware/authMiddleware");

const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

// ==============================
// 🔓 PUBLIC ROUTES (Admin Auth)
// ==============================
router.post("/signup", authController.adminSignup);
router.post("/login", authController.adminLogin);
router.post("/verify-otp", authController.verifyAdminOTP);
router.post("/logout", authController.logout);

// NEW ROUTE: Check if Super Admin exists (Public)
router.get("/check-super-admin", adminController.checkSuperAdmin);

// ==============================
// 🔒 PROTECTED ROUTES
// ==============================
router.use(protect);

// --- SHARED ADMIN ACCESS ---
router.get("/all-students", adminAccess, adminController.getAllStudents);
router.post("/suspend-user", adminAccess, adminController.suspendUser);
router.post("/toggle-ban", adminAccess, adminController.toggleBanUser);

// --- SUPER ADMIN ONLY ---
router.post("/approve-admin", superAdminOnly, adminController.approveAdmin);
router.post(
  "/reject-admin",
  superAdminOnly,
  adminController.rejectAdminRequest
);
router.post("/delete-user/:id", superAdminOnly, adminController.deleteUser);

router.get("/pending-admins", superAdminOnly, adminController.getPendingAdmins);
router.get("/sub-admins", superAdminOnly, adminController.getAllSubAdmins);
router.get(
  "/passout-students",
  superAdminOnly,
  adminController.getPassoutStudents
);
router.get("/activities", superAdminOnly, adminController.getActivities);

module.exports = router;
