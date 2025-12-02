const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Import Controllers
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// ==========================================
// 🔓 PUBLIC ROUTES (No Login Required)
// ==========================================
// The server reads top-to-bottom. These are matched BEFORE the protect middleware.

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// ==========================================
// 🔒 PROTECTED ROUTES (Login Required)
// ==========================================
// Any route defined BELOW this line requires a valid JWT token.
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

// --- Admin Actions on User Data ---
router.post(
  "/admin/approve-promotion",
  adminOnly,
  userController.adminApprovePromotion
);
router.get(
  "/admin/pending-promotions",
  adminOnly,
  userController.getAllPendingPromotions
);
router.get("/admin/all-students", adminOnly, userController.getAllStudents);

module.exports = router;
