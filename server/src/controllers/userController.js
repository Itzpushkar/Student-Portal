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

// --- HELPER: ENHANCED PDF EMAIL ---
const sendSemesterUpdateEmail = async (user) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const pdfPath = `uploads/Student_Report_${user.enrollmentNo}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // 1. CALCULATE STATS
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

    // 2. HEADER (Profile Photo + Info)
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Student Academic Report", { align: "center" });
    doc.moveDown(2);

    // Embed Profile Photo if exists
    if (
      user.personalDetails?.profilePhoto &&
      fs.existsSync(user.personalDetails.profilePhoto)
    ) {
      try {
        doc.image(user.personalDetails.profilePhoto, 50, 100, {
          width: 100,
          height: 100,
          fit: [100, 100],
        });
      } catch (imgErr) {
        console.error("Profile image error", imgErr);
      }
    }

    // Student Details (Aligned to right of photo)
    const startX = 170;
    let currentY = 100;

    doc.fontSize(12).font("Helvetica");
    doc.text(`Name: ${user.personalDetails?.fullName}`, startX, currentY);
    currentY += 20;
    doc.text(`Enrollment No: ${user.enrollmentNo}`, startX, currentY);
    currentY += 20;
    doc.text(`Branch: ${user.personalDetails?.branch}`, startX, currentY);
    currentY += 20;
    doc.text(`Email: ${user.email}`, startX, currentY);
    currentY += 20;
    doc.text(`Current Semester: ${user.currentSemester}`, startX, currentY);
    currentY += 20;

    doc.font("Helvetica-Bold");
    doc.text(`CGPA: ${cgpa}`, startX, currentY);
    currentY += 20;
    doc.text(`Total Backlogs: ${totalBacklogs}`, startX, currentY);

    doc.moveDown(4); // Space after header

    // 3. ACADEMIC HISTORY
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Academic History", 50, doc.y, { underline: true });
    doc.moveDown();

    user.academicDetails
      .sort((a, b) => a.semester - b.semester)
      .forEach((sem) => {
        // Prevent page break in middle of block
        if (doc.y > 650) doc.addPage();

        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(`Semester ${sem.semester}`);
        doc.fontSize(12).font("Helvetica").text(`GPA: ${sem.gpa}`);
        doc.text(`Backlogs: ${sem.backlogs}`);
        if (sem.remarks) doc.text(`Remarks: ${sem.remarks}`);
        doc.moveDown(0.5);

        // Embed Result Image
        if (sem.marksheetImages && sem.marksheetImages.length > 0) {
          const imgPath = sem.marksheetImages[0]; // Assuming 1 image per sem for now
          if (fs.existsSync(imgPath)) {
            try {
              doc.text("Result Marksheet:", { underline: true });
              doc.image(imgPath, { width: 400 }); // Large preview
              doc.moveDown();
            } catch (err) {
              doc.text("[Image Error]");
            }
          } else {
            doc.text("[Image Not Found on Server]");
          }
        }
        doc.moveDown(2); // Space between semesters
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

      // Cleanup
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
    user.personalDetails.fullName = req.body.fullName;
    user.personalDetails.dob = req.body.dob;
    user.personalDetails.contact = req.body.contact;
    user.personalDetails.address = req.body.address;
    user.personalDetails.course = req.body.course;
    user.personalDetails.branch = req.body.branch;
    user.personalDetails.tenthPercentage = req.body.tenthPercentage;

    if (req.file) user.personalDetails.profilePhoto = req.file.path;
    user.isPersonalDetailsCompleted = true;

    await user.save();
    res.json({ msg: "Profile Updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating profile" });
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

    // Send the Enhanced PDF
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
