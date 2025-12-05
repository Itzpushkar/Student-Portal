const express = require("express");
const router = express.Router();
// FIX: Path is now relative to src/routes, so go up one level (..) to src/middleware
const {
  protect,
  superAdminOnly,
  adminAccess,
} = require("../middleware/authMiddleware");

// Import Controllers (up one level to src/controllers)
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

// ==============================
// 🔓 PUBLIC ROUTES (Admin Auth)
// ==============================
router.post("/signup", authController.adminSignup);
router.post("/login", authController.adminLogin);
router.post("/verify-otp", authController.verifyAdminOTP);
router.post("/logout", authController.logout);

// ==============================
// 🔒 PROTECTED ROUTES
// ==============================
router.use(protect); // All routes below require token

// --- SHARED ADMIN ACCESS (Super + Sub) ---
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
