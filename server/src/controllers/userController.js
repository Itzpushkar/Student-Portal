const User = require("../models/User");
const PromotionRequest = require("../models/PromotionRequest");
const Notification = require("../models/Notification");
const Broadcast = require("../models/Broadcast");
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

// --- HELPER: PDF EMAIL ---
const sendSemesterUpdateEmail = async (user) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const pdfPath = `uploads/Student_Report_${user.enrollmentNo}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Student Academic Report", { align: "center" });
    doc.moveDown(2);

    // Profile Photo
    if (
      user.personalDetails?.profilePhoto &&
      fs.existsSync(user.personalDetails.profilePhoto)
    ) {
      try {
        doc.image(
          user.personalDetails.profilePhoto,
          (doc.page.width - 100) / 2,
          100,
          { width: 100, height: 100, fit: [100, 100] }
        );
        doc.moveDown(8);
      } catch (e) {
        doc.moveDown(4);
      }
    } else {
      doc.moveDown(4);
    }

    // Info
    doc.fontSize(12).font("Helvetica");
    const info = [
      `Name: ${user.personalDetails?.fullName}`,
      `Enrollment No: ${user.enrollmentNo}`,
      `Branch: ${user.personalDetails?.branch}`,
      `Email: ${user.email}`,
      `Current Semester: ${user.currentSemester}`,
    ];
    info.forEach((line) => doc.text(line, { align: "center" }));
    doc.moveDown(2);

    // Academic History
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Academic Details", { underline: true });
    doc.moveDown();

    user.academicDetails
      .sort((a, b) => a.semester - b.semester)
      .forEach((sem) => {
        if (doc.y > 650) doc.addPage();
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(`Semester ${sem.semester}`);
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`GPA: ${sem.gpa} | Backlogs: ${sem.backlogs}`);

        if (sem.marksheetImages?.[0] && fs.existsSync(sem.marksheetImages[0])) {
          doc.moveDown(0.5);
          try {
            doc.image(sem.marksheetImages[0], { width: 400 });
          } catch (e) {
            doc.text("[Image Error]");
          }
          doc.moveDown();
        }
        doc.moveDown(1);
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
        text: `Dear Student,\n\nPlease find attached your updated academic report.\n\nRegards,\nAdmin`,
        attachments: [{ filename: `Report.pdf`, path: pdfPath }],
      });
      setTimeout(() => {
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      }, 5000);
    });
  } catch (error) {
    console.error("PDF Error:", error);
  }
};

// --- DATA FETCHING ---
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.accountStatus?.status === "Banned")
      return res.status(403).json({ msg: "ACCOUNT_BANNED" });

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

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ msg: "Read" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.getBroadcasts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const branch = user.personalDetails?.branch || "General";
    const sem = user.currentSemester.toString();

    const broadcasts = await Broadcast.find({
      $or: [
        { "targetAudience.branch": "All" },
        {
          "targetAudience.branch": branch,
          $or: [
            { "targetAudience.semester": "All" },
            { "targetAudience.semester": sem },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- UPDATES ---
exports.savePersonalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.email) user.email = req.body.email;

    // Update fields
    [
      "fullName",
      "dob",
      "contact",
      "address",
      "course",
      "branch",
      "tenthPercentage",
    ].forEach((field) => {
      if (req.body[field]) user.personalDetails[field] = req.body[field];
    });

    if (req.file) user.personalDetails.profilePhoto = req.file.path;
    user.isPersonalDetailsCompleted = true;

    await user.save();
    res.json({ msg: "Profile Updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile" });
  }
};

exports.submitSemester = async (req, res) => {
  try {
    const { semester, gpa, backlogs, remarks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.isPersonalDetailsCompleted)
      return res.status(400).json({ msg: "Fill personal details first." });

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

    sendSemesterUpdateEmail(user); // Send Email

    res.json({ msg: "Saved & Email Sent" });
  } catch (err) {
    res.status(500).json({ msg: "Error saving details" });
  }
};

exports.requestPromotion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const existing = await PromotionRequest.findOne({
      userId: user._id,
      status: "pending",
    });
    if (existing) return res.status(400).json({ msg: "Request pending" });
    await new PromotionRequest({
      userId: user._id,
      enrollmentNo: user.enrollmentNo,
      currentSemester: user.currentSemester,
      requestedSemester: user.currentSemester + 1,
    }).save();
    res.json({ msg: "Requested" });
  } catch (e) {
    res.status(500).json({ msg: "Error" });
  }
};

// --- ADMIN ---
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

      // Notify Student
      await new Notification({
        userId: user._id,
        title: "Promotion Approved",
        message: `Promoted to Sem ${user.currentSemester}`,
        type: "success",
      }).save();
    } else {
      await new Notification({
        userId: request.userId,
        title: "Promotion Rejected",
        message: "Contact Admin.",
        type: "error",
      }).save();
    }
    res.json({ msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.getAllPendingPromotions = async (req, res) => {
  const list = await PromotionRequest.find({ status: "pending" }).populate(
    "userId",
    "personalDetails.fullName username"
  );
  res.json(list);
};

exports.getAllStudents = async (req, res) => {
  const users = await User.find({ role: "student" });
  res.json(users);
};
