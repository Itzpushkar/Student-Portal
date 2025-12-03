const express = require("express");
const router = express.Router();
// FIX: Import 'adminAccess' instead of 'adminOnly' (which was removed/renamed)
const { protect, adminAccess } = require("../middleware/authMiddleware");

// Import Controllers
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// ==========================================
// 🔓 PUBLIC ROUTES (No Login Required)
// ==========================================
router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// ==========================================
// 🔒 PROTECTED ROUTES (Login Required)
// ==========================================
router.use(protect);

// --- Student Dashboard & Profile ---
router.post("/dashboard", userController.getDashboard);
router.post(
  "/personal",
  userController.uploadProfilePhoto,
  userController.handleUploadError,
  userController.savePersonalDetails
);

// --- Academic Details ---
router.post(
  "/academic",
  userController.uploadMarksheets,
  userController.handleUploadError,
  userController.submitSemester
);
router.post("/request-promotion", userController.requestPromotion);

// --- ADMIN ROUTES (Inside User Scope) ---
// These manage student-specific admin actions (Promotions)
// FIX: Use 'adminAccess' middleware here
router.post(
  "/admin/approve-promotion",
  adminAccess,
  userController.adminApprovePromotion
);
router.get(
  "/admin/pending-promotions",
  adminAccess,
  userController.getAllPendingPromotions
);

// Note: 'getAllStudents' is handled in adminRoutes.js mostly,
// but we keep this here updated to adminAccess just in case.
router.get("/admin/all-students", adminAccess, userController.getAllStudents);

module.exports = router;
