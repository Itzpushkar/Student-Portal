const User = require("../models/User");
const PromotionRequest = require("../models/PromotionRequest");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

// --- MULTER CONFIG ---
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

// --- HELPER: PAGE-PER-SEMESTER PDF ---
const sendSemesterUpdateEmail = async (user) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const pdfPath = `uploads/Student_Report_${user.enrollmentNo}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // --- PAGE 1: PERSONAL DETAILS ---

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Student Academic Report", { align: "center" });
    doc.moveDown(2);

    // Profile Photo
    if (
      user.personalDetails?.profilePhoto &&
      fs.existsSync(user.personalDetails.profilePhoto)
    ) {
      try {
        // Centered Photo
        const x = (doc.page.width - 150) / 2;
        doc.image(user.personalDetails.profilePhoto, x, 120, {
          width: 150,
          height: 150,
          fit: [150, 150],
          align: "center",
        });
        doc.moveDown(10);
      } catch (imgErr) {
        console.error("Image Error", imgErr);
        doc.moveDown(4);
      }
    } else {
      doc.moveDown(8);
    }

    // Personal Info Table-ish layout
    const startX = 100;
    let currentY = doc.y + 20;

    // Calculations
    const totalBacklogs = user.academicDetails.reduce(
      (sum, sem) => sum + (parseInt(sem.backlogs) || 0),
      0
    );
    const totalGpa = user.academicDetails.reduce(
      (sum, sem) => sum + (parseFloat(sem.gpa) || 0),
      0
    );
    const cgpa = user.academicDetails.length
      ? (totalGpa / user.academicDetails.length).toFixed(2)
      : "0.00";

    const addField = (label, value) => {
      doc.fontSize(14).font("Helvetica-Bold").text(label, startX, currentY);
      doc.font("Helvetica").text(value, startX + 150, currentY);
      currentY += 30;
    };

    addField("Name:", user.personalDetails?.fullName);
    addField("Enrollment No:", user.enrollmentNo);
    addField("Email:", user.email);
    addField("Branch:", user.personalDetails?.branch);
    addField("Current Semester:", user.currentSemester);
    currentY += 10; // Spacing
    doc.font("Helvetica-Bold").fillColor("blue");
    addField("Current CGPA:", cgpa);
    doc.fillColor("red");
    addField("Total Backlogs:", totalBacklogs);
    doc.fillColor("black"); // Reset

    // --- PAGE 2+: SEMESTER DETAILS ---
    // Sort semesters to ensure order 1, 2, 3...
    const sortedSemesters = user.academicDetails.sort(
      (a, b) => a.semester - b.semester
    );

    sortedSemesters.forEach((sem) => {
      doc.addPage(); // Force new page for every semester

      // Semester Header
      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(`Semester ${sem.semester} Details`, { align: "center" });
      doc.moveDown(2);

      // Stats
      doc.fontSize(16).font("Helvetica");
      doc.text(`GPA Obtained:  ${sem.gpa}`);
      doc.moveDown(0.5);
      doc.text(`Backlogs:      ${sem.backlogs}`);
      if (sem.remarks) {
        doc.moveDown(0.5);
        doc.text(`Remarks:       ${sem.remarks}`);
      }

      doc.moveDown(2);

      // Marksheet Image
      if (sem.marksheetImages && sem.marksheetImages.length > 0) {
        const imgPath = sem.marksheetImages[0];
        if (fs.existsSync(imgPath)) {
          try {
            doc
              .fontSize(14)
              .font("Helvetica-Bold")
              .text("Result Marksheet:", { underline: true });
            doc.moveDown();
            // Fit image to page width minus margins
            doc.image(imgPath, { width: 500, align: "center" });
          } catch (err) {
            doc.text("[Image File Corrupt or Unsupported]");
          }
        } else {
          doc.text("[Marksheet Image Not Found on Server]");
        }
      } else {
        doc.text("[No Marksheet Uploaded]");
      }
    });

    doc.end();

    writeStream.on("finish", async () => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Updated Academic Report",
        text: `Dear ${user.personalDetails?.fullName},\n\nPlease find attached your comprehensive academic report including your latest results.\n\nRegards,\nStudent Portal Admin`,
        attachments: [
          { filename: `Report_${user.enrollmentNo}.pdf`, path: pdfPath },
        ],
      });

      setTimeout(() => {
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      }, 5000);
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }
};

// --- DASHBOARD & PROFILE ---
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.accountStatus?.status === "Banned") {
      return res.status(403).json({ msg: "ACCOUNT_BANNED" });
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

    // Update Email if provided
    if (req.body.email) user.email = req.body.email;

    if (req.body.fullName) user.personalDetails.fullName = req.body.fullName;
    if (req.body.dob) user.personalDetails.dob = req.body.dob;
    if (req.body.contact) user.personalDetails.contact = req.body.contact;
    if (req.body.address) user.personalDetails.address = req.body.address;
    if (req.body.course) user.personalDetails.course = req.body.course;
    if (req.body.branch) user.personalDetails.branch = req.body.branch;
    if (req.body.tenthPercentage)
      user.personalDetails.tenthPercentage = req.body.tenthPercentage;

    if (req.file) user.personalDetails.profilePhoto = req.file.path;

    user.isPersonalDetailsCompleted = true;

    await user.save();
    res.json({ msg: "Profile Updated", user });
  } catch (err) {
    console.error("Save Profile Error:", err);
    res.status(500).json({ msg: "Error updating profile: " + err.message });
  }
};

// --- ACADEMICS ---
exports.submitSemester = async (req, res) => {
  try {
    const { semester, gpa, backlogs, remarks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.isPersonalDetailsCompleted) {
      return res
        .status(400)
        .json({ msg: "Please fill personal details first." });
    }

    const newDetails = {
      semester: parseInt(semester),
      gpa,
      backlogs,
      remarks,
      marksheetImages: req.files.map((f) => f.path),
      isCompleted: true,
    };

    const index = user.academicDetails.findIndex((a) => a.semester == semester);
    if (index > -1) user.academicDetails[index] = newDetails;
    else user.academicDetails.push(newDetails);

    user.isAcademicDetailsCompleted = true;
    await user.save();

    sendSemesterUpdateEmail(user);

    res.json({ msg: "Saved & Email Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error saving academic details" });
  }
};

exports.requestPromotion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const existing = await PromotionRequest.findOne({
      userId: user._id,
      status: "pending",
    });
    if (existing)
      return res.status(400).json({ msg: "Request already pending" });

    await new PromotionRequest({
      userId: user._id,
      enrollmentNo: user.enrollmentNo,
      currentSemester: user.currentSemester,
      requestedSemester: user.currentSemester + 1,
    }).save();

    res.json({ msg: "Promotion Requested" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

// --- ADMIN FEATURES ---
exports.getAllPendingPromotions = async (req, res) => {
  try {
    const requests = await PromotionRequest.find({
      status: "pending",
    }).populate("userId", "personalDetails.fullName username");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.adminApprovePromotion = async (req, res) => {
  try {
    const { requestId, decision } = req.body;
    const request = await PromotionRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Not found" });

    request.status = decision;
    await request.save();

    if (decision === "approved") {
      const user = await User.findById(request.userId);
      user.currentSemester = request.requestedSemester;
      await user.save();
    }
    res.json({ msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.getAllStudents = async (req, res) => {
  const users = await User.find({ role: "student" }).select("-password");
  res.json(users);
};
