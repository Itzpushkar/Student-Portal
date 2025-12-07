const express = require("express");
const router = express.Router();
const { protect, adminAccess } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// PUBLIC
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOTP);
router.post("/reset-password", authController.resetPassword);

// PROTECTED
router.use(protect);

router.get("/dashboard", userController.getDashboard);
router.post(
  "/personal",
  userController.uploadProfilePhoto,
  userController.handleUploadError,
  userController.savePersonalDetails
);
router.post(
  "/academic",
  userController.uploadMarksheets,
  userController.handleUploadError,
  userController.submitSemester
);
router.post("/request-promotion", userController.requestPromotion);
router.post("/change-password", authController.changePassword);

// NEW ROUTES
router.get("/notifications", userController.getNotifications);
router.put("/notifications/:id/read", userController.markNotificationRead);
router.get("/broadcasts", userController.getBroadcasts);

// ADMIN ACTIONS
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
