// // const User = require("../models/User");
// // const PromotionRequest = require("../models/PromotionRequest");
// // const fs = require("fs");
// // const path = require("path");
// // const multer = require("multer");

// // // --- MULTER CONFIG ---
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const dir = "uploads/marksheets";
// //     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// //     cb(null, dir);
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `Marksheet-${Date.now()}${path.extname(file.originalname)}`);
// //   },
// // });
// // const upload = multer({ storage });

// // exports.uploadMarksheets = upload.array("marksheets", 5);
// // exports.uploadProfilePhoto = upload.single("profilePhoto");
// // exports.handleUploadError = (err, req, res, next) => {
// //   if (err) return res.status(400).json({ msg: err.message });
// //   next();
// // };

// // // --- DASHBOARD & PROFILE ---
// // exports.getDashboard = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id).select("-password");
// //     if (!user) return res.status(404).json({ msg: "User not found" });

// //     // Ensure banned users can't see dashboard data even if token is valid
// //     if (user.accountStatus?.status === "Banned") {
// //       return res.status(403).json({ msg: "ACCOUNT_BANNED" });
// //     }

// //     const pendingRequest = await PromotionRequest.findOne({
// //       userId: user._id,
// //       status: "pending",
// //     });

// //     res.json({
// //       ...user.toObject(),
// //       promotionStatus: pendingRequest ? "pending" : "none",
// //     });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server Error" });
// //   }
// // };

// // exports.savePersonalDetails = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id);
// //     Object.assign(user.personalDetails, req.body);
// //     if (req.file) user.personalDetails.profilePhoto = req.file.path;
// //     user.isPersonalDetailsCompleted = true;
// //     await user.save();
// //     res.json({ msg: "Profile Updated", user });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Error updating profile" });
// //   }
// // };

// // // --- ACADEMICS ---
// // exports.submitSemester = async (req, res) => {
// //   try {
// //     const { semester, gpa, backlogs, remarks } = req.body;
// //     const user = await User.findById(req.user._id);

// //     const newDetails = {
// //       semester,
// //       gpa,
// //       backlogs,
// //       remarks,
// //       marksheetImages: req.files.map((f) => f.path),
// //       isCompleted: true,
// //     };

// //     const index = user.academicDetails.findIndex((a) => a.semester == semester);
// //     if (index > -1) user.academicDetails[index] = newDetails;
// //     else user.academicDetails.push(newDetails);

// //     user.isAcademicDetailsCompleted = true;
// //     await user.save();
// //     res.json({ msg: "Saved" });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Error" });
// //   }
// // };

// // exports.requestPromotion = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id);
// //     const existing = await PromotionRequest.findOne({
// //       userId: user._id,
// //       status: "pending",
// //     });
// //     if (existing) return res.status(400).json({ msg: "Request pending" });

// //     await new PromotionRequest({
// //       userId: user._id,
// //       enrollmentNo: user.enrollmentNo,
// //       currentSemester: user.currentSemester,
// //       requestedSemester: user.currentSemester + 1,
// //     }).save();

// //     res.json({ msg: "Promotion Requested" });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Error" });
// //   }
// // };

// // // --- ADMIN FEATURES (Accessed via User Scope) ---
// // exports.getAllPendingPromotions = async (req, res) => {
// //   try {
// //     const requests = await PromotionRequest.find({
// //       status: "pending",
// //     }).populate("userId", "personalDetails.fullName username");
// //     res.json(requests);
// //   } catch (err) {
// //     res.status(500).json({ msg: "Error" });
// //   }
// // };

// // exports.adminApprovePromotion = async (req, res) => {
// //   try {
// //     const { requestId, decision } = req.body;
// //     const request = await PromotionRequest.findById(requestId);
// //     if (!request) return res.status(404).json({ msg: "Not found" });

// //     request.status = decision;
// //     await request.save();

// //     if (decision === "approved") {
// //       const user = await User.findById(request.userId);
// //       user.currentSemester = request.requestedSemester;
// //       user.isAcademicDetailsCompleted = false;
// //       await user.save();
// //     }
// //     res.json({ msg: "Success" });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Error" });
// //   }
// // };

// // exports.getAllStudents = async (req, res) => {
// //   const users = await User.find({ role: "student" }).select("-password");
// //   res.json(users);
// // };

// const User = require("../models/User");
// const PromotionRequest = require("../models/PromotionRequest");
// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const PDFDocument = require("pdfkit");
// const nodemailer = require("nodemailer");

// // --- MULTER CONFIG ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/marksheets";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `Marksheet-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({ storage });

// exports.uploadMarksheets = upload.array("marksheets", 5);
// exports.uploadProfilePhoto = upload.single("profilePhoto");
// exports.handleUploadError = (err, req, res, next) => {
//   if (err) return res.status(400).json({ msg: err.message });
//   next();
// };

// // --- HELPER: SEND PDF EMAIL ---
// const sendSemesterUpdateEmail = async (user) => {
//   try {
//     const doc = new PDFDocument();
//     const pdfPath = `uploads/Student_Report_${user.enrollmentNo}.pdf`;
//     const writeStream = fs.createWriteStream(pdfPath);

//     doc.pipe(writeStream);

//     // PDF Content
//     doc.fontSize(20).text("Student Academic Report", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(12).text(`Name: ${user.personalDetails?.fullName}`);
//     doc.text(`Enrollment No: ${user.enrollmentNo}`);
//     doc.text(`Branch: ${user.personalDetails?.branch}`);
//     doc.moveDown();
//     doc.text("Academic Details:", { underline: true });

//     user.academicDetails.forEach((sem) => {
//       doc.text(
//         `Semester ${sem.semester}: GPA ${sem.gpa} | Backlogs: ${sem.backlogs}`
//       );
//     });

//     // Add Marksheet Images if allowed/available (Optional, complex due to layout)
//     // doc.image(path_to_image, { width: 300 })

//     doc.end();

//     writeStream.on("finish", async () => {
//       // Send Email
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//       });

//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Academic Details Updated",
//         text: "Please find your updated academic report attached.",
//         attachments: [{ filename: "Report.pdf", path: pdfPath }],
//       });

//       // Cleanup
//       fs.unlinkSync(pdfPath);
//     });
//   } catch (error) {
//     console.error("PDF Email Error:", error);
//   }
// };

// // --- DASHBOARD & PROFILE ---
// exports.getDashboard = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     if (user.accountStatus?.status === "Banned") {
//       return res.status(403).json({ msg: "ACCOUNT_BANNED" });
//     }

//     // Check for any PENDING promotion request
//     const pendingRequest = await PromotionRequest.findOne({
//       userId: user._id,
//       status: "pending",
//     });

//     res.json({
//       ...user.toObject(),
//       promotionStatus: pendingRequest ? "pending" : "none",
//     });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// exports.savePersonalDetails = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     Object.assign(user.personalDetails, req.body);
//     if (req.file) user.personalDetails.profilePhoto = req.file.path;
//     user.isPersonalDetailsCompleted = true;
//     await user.save();
//     res.json({ msg: "Profile Updated", user });
//   } catch (err) {
//     res.status(500).json({ msg: "Error updating profile" });
//   }
// };

// // --- ACADEMICS ---
// exports.submitSemester = async (req, res) => {
//   try {
//     const { semester, gpa, backlogs, remarks } = req.body;
//     const user = await User.findById(req.user._id);

//     // Check Personal Details First (Backend Safeguard)
//     if (!user.isPersonalDetailsCompleted) {
//       return res
//         .status(400)
//         .json({ msg: "Please fill personal details first." });
//     }

//     const newDetails = {
//       semester: parseInt(semester),
//       gpa,
//       backlogs,
//       remarks,
//       marksheetImages: req.files.map((f) => f.path),
//       isCompleted: true,
//     };

//     const index = user.academicDetails.findIndex((a) => a.semester == semester);
//     if (index > -1) user.academicDetails[index] = newDetails;
//     else user.academicDetails.push(newDetails);

//     user.isAcademicDetailsCompleted = true;
//     await user.save();

//     // Trigger PDF Email
//     sendSemesterUpdateEmail(user);

//     res.json({ msg: "Saved & Email Sent" });
//   } catch (err) {
//     res.status(500).json({ msg: "Error saving academic details" });
//   }
// };

// exports.requestPromotion = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     const existing = await PromotionRequest.findOne({
//       userId: user._id,
//       status: "pending",
//     });
//     if (existing)
//       return res.status(400).json({ msg: "Request already pending" });

//     await new PromotionRequest({
//       userId: user._id,
//       enrollmentNo: user.enrollmentNo,
//       currentSemester: user.currentSemester,
//       requestedSemester: user.currentSemester + 1,
//     }).save();

//     res.json({ msg: "Promotion Requested" });
//   } catch (err) {
//     res.status(500).json({ msg: "Error" });
//   }
// };

// // --- ADMIN FEATURES (Accessed via User Scope) ---
// exports.getAllPendingPromotions = async (req, res) => {
//   try {
//     const requests = await PromotionRequest.find({
//       status: "pending",
//     }).populate("userId", "personalDetails.fullName username");
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ msg: "Error" });
//   }
// };

// exports.adminApprovePromotion = async (req, res) => {
//   try {
//     const { requestId, decision } = req.body;
//     const request = await PromotionRequest.findById(requestId);
//     if (!request) return res.status(404).json({ msg: "Not found" });

//     request.status = decision;
//     await request.save();

//     if (decision === "approved") {
//       const user = await User.findById(request.userId);
//       user.currentSemester = request.requestedSemester;
//       // Note: We do NOT reset isAcademicDetailsCompleted because previous data is still valid history
//       await user.save();
//     }
//     res.json({ msg: "Success" });
//   } catch (err) {
//     res.status(500).json({ msg: "Error" });
//   }
// };

// exports.getAllStudents = async (req, res) => {
//   const users = await User.find({ role: "student" }).select("-password");
//   res.json(users);
// };

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

// --- HELPER: SEND PDF EMAIL ---
const sendSemesterUpdateEmail = async (user) => {
  try {
    const doc = new PDFDocument();
    const pdfPath = `uploads/Student_Report_${user.enrollmentNo}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // PDF Content
    doc.fontSize(20).text("Student Academic Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${user.personalDetails?.fullName}`);
    doc.text(`Enrollment No: ${user.enrollmentNo}`);
    doc.text(`Branch: ${user.personalDetails?.branch}`);
    doc.moveDown();
    doc.text("Academic Details:", { underline: true });

    user.academicDetails.forEach((sem) => {
      doc.text(
        `Semester ${sem.semester}: GPA ${sem.gpa} | Backlogs: ${sem.backlogs}`
      );
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
        subject: "Academic Details Updated",
        text: "Please find your updated academic report attached.",
        attachments: [{ filename: "Report.pdf", path: pdfPath }],
      });

      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    console.error("PDF Email Error:", error);
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

    // Explicitly update fields to ensure Mongoose detects changes
    user.personalDetails.fullName = req.body.fullName;
    user.personalDetails.dob = req.body.dob;
    user.personalDetails.contact = req.body.contact;
    user.personalDetails.address = req.body.address;
    user.personalDetails.course = req.body.course;
    user.personalDetails.branch = req.body.branch;
    user.personalDetails.tenthPercentage = req.body.tenthPercentage; // Fix for Issue 3

    if (req.file) user.personalDetails.profilePhoto = req.file.path;

    user.isPersonalDetailsCompleted = true; // Fix for Issue 2

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

    sendSemesterUpdateEmail(user);

    res.json({ msg: "Saved & Email Sent" });
  } catch (err) {
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
