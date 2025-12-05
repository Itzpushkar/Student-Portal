const express = require("express");
const router = express.Router();
// FIX: Path relative to src/routes
const { protect, adminAccess } = require("../middleware/authMiddleware");

// Import Controllers
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// ==============================
// 🔓 PUBLIC ROUTES (Student Auth)
// ==============================
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.post("/logout", authController.logout);

// ==============================
// 🔒 PROTECTED ROUTES
// ==============================
router.use(protect);

// --- DASHBOARD & PROFILE ---
router.get("/dashboard", userController.getDashboard);
router.post(
  "/personal",
  userController.uploadProfilePhoto,
  userController.handleUploadError,
  userController.savePersonalDetails
);

// --- ACADEMIC ---
router.post(
  "/academic",
  userController.uploadMarksheets,
  userController.handleUploadError,
  userController.submitSemester
);
router.post("/request-promotion", userController.requestPromotion);

// --- ADMIN ACTIONS (Student-Specific) ---
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
router.get("/admin/all-students", adminAccess, userController.getAllStudents);

module.exports = router;
