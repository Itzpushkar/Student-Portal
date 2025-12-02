const User = require("../models/User");
const PromotionRequest = require("../models/PromotionRequest");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ExcelJS = require("exceljs");
const { sendEmailWithAttachment } = require("../utils/emailService");

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/marksheets";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `Marksheet-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

exports.uploadMarksheets = upload.array("marksheets", 5);
exports.uploadProfilePhoto = upload.single("profilePhoto");
exports.handleUploadError = (err, req, res, next) => {
  if (err) return res.status(400).json({ msg: err.message });
  next();
};

// --- DASHBOARD & PROFILE ---
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Ban Check
    if (user.accountStatus?.isDisabled) {
      return res
        .status(403)
        .json({
          msg: "ACCOUNT_DISABLED",
          details: user.accountStatus.disableReason,
        });
    }

    const pendingRequest = await PromotionRequest.findOne({
      userId: user._id,
      status: "pending",
    });

    res.json({
      ...user.toObject(),
      promotionStatus: pendingRequest ? "pending" : "none",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.savePersonalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Update fields
    const { fullName, dob, contact, address, course, branch, tenthPercentage } =
      req.body;
    if (fullName) user.personalDetails.fullName = fullName;
    if (dob) user.personalDetails.dob = dob;
    if (contact) user.personalDetails.contact = contact;
    if (address) user.personalDetails.address = address;
    if (course) user.personalDetails.course = course;
    if (branch) user.personalDetails.branch = branch;
    if (tenthPercentage) user.personalDetails.tenthPercentage = tenthPercentage;

    if (req.file) user.personalDetails.profilePhoto = req.file.path;

    user.isPersonalDetailsCompleted = true;
    await user.save();
    res.json({ msg: "Profile Updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- ACADEMICS & PROMOTION ---
exports.submitSemester = async (req, res) => {
  try {
    const { semester, gpa, backlogs, remarks } = req.body;
    const user = await User.findById(req.user._id);

    const semIndex = user.academicDetails.findIndex(
      (a) => a.semester == semester
    );
    const newDetails = {
      semester,
      gpa,
      backlogs,
      remarks,
      marksheetImages: req.files.map((f) => f.path),
      isCompleted: true,
    };

    if (semIndex > -1) {
      user.academicDetails[semIndex] = newDetails;
    } else {
      user.academicDetails.push(newDetails);
    }

    user.isAcademicDetailsCompleted = true;
    await user.save();
    res.json({ msg: "Academic Details Saved" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.requestPromotion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if request exists
    const existing = await PromotionRequest.findOne({
      userId: user._id,
      status: "pending",
    });
    if (existing)
      return res.status(400).json({ msg: "Request already pending" });

    const newRequest = new PromotionRequest({
      userId: user._id,
      enrollmentNo: user.enrollmentNo,
      currentSemester: user.currentSemester,
      requestedSemester: user.currentSemester + 1,
    });

    await newRequest.save();
    res.json({ msg: "Promotion Requested" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- ADMIN FUNCTIONS (Used by AdminDashboard) ---
exports.getAllPendingPromotions = async (req, res) => {
  try {
    const requests = await PromotionRequest.find({
      status: "pending",
    }).populate("userId", "personalDetails.fullName username accountStatus");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.adminApprovePromotion = async (req, res) => {
  try {
    const { requestId, decision } = req.body; // decision: 'approved' or 'rejected'
    const request = await PromotionRequest.findById(requestId);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    request.status = decision;
    await request.save();

    if (decision === "approved") {
      const user = await User.findById(request.userId);
      user.currentSemester = request.requestedSemester;
      user.isAcademicDetailsCompleted = false; // Reset for new sem
      await user.save();
    }

    res.json({ msg: `Request ${decision}` });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Just a placeholder if needed, real one is in adminController
exports.getAllStudents = async (req, res) => {
  /* Logic handled in adminController, but routes might point here */
  // If route points here:
  const users = await User.find({ role: "student" }).select("-password");
  res.json(users);
};
