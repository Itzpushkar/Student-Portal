// const User = require('../models/User');
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');
// const { sendEmailWithAttachment } = require('../utils/emailService');

// // exports.getDashboard = async (req, res) => {
// //   try {
// //     const { userId } = req.body;
// //     const user = await User.findById(userId);
// //     if (!user) return res.status(404).json({ msg: 'User not found' });

// //     res.json({
// //       personalDetails: user.personalDetails,
// //       currentSemester: user.currentSemester,
// //       academicDetails: user.academicDetails
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };

// exports.getDashboard = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = await User.findById(userId);

//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     // Determine semester statuses
//     const totalSemesters = 8; // Example: 8 semesters total
//     const semestersStatus = [];

//     for (let i = 1; i <= totalSemesters; i++) {
//       const academic = user.academicDetails.find(a => a.semester === i);
//       if (academic) {
//         semestersStatus.push({ semester: i, status: "editable" }); // past semester
//       } else if (i === user.currentSemester) {
//         semestersStatus.push({ semester: i, status: "new" }); // current semester
//       } else if (i > user.currentSemester) {
//         semestersStatus.push({ semester: i, status: "locked" }); // future semester
//       } else {
//         semestersStatus.push({ semester: i, status: "locked" }); // default
//       }
//     }

//     res.json({
//       personalDetails: user.personalDetails,
//       currentSemester: user.currentSemester,
//       academicDetails: user.academicDetails,
//       semestersStatus
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


// exports.savePersonalDetails = async (req, res) => {
//   try {
//     const { userId, personalDetails } = req.body;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     user.personalDetails = { ...user.personalDetails, ...personalDetails };
//     await user.save();

//     res.json({ msg: 'Personal details saved successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.submitSemester = async (req, res) => {
//   try {
//     const { userId, semester, gpa, backlogs, remarks } = req.body;
//     const uploadedFiles = req.files ? req.files.map(f => f.filename) : [];

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const existing = user.academicDetails.find(a => a.semester === Number(semester));
//     if (existing) {
//       existing.gpa = gpa;
//       existing.backlogs = backlogs;
//       existing.remarks = remarks;
//       existing.uploads = uploadedFiles;
//     } else {
//       user.academicDetails.push({ semester: Number(semester), gpa, backlogs, remarks, uploads: uploadedFiles });
//     }

//     if (!user.currentSemester || semester > user.currentSemester) {
//       user.currentSemester = Number(semester);
//     }

//     await user.save();

//     // Generate PDF
//     const pdfPath = path.join(__dirname, `../uploads/${user.username}_Semester${semester}_Summary.pdf`);
//     const doc = new PDFDocument();
//     const writeStream = fs.createWriteStream(pdfPath);
//     doc.pipe(writeStream);

//     doc.fontSize(20).text('🎓 Semester Summary', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(14).text(`Name: ${user.personalDetails.fullName}`);
//     doc.text(`Email: ${user.email}`);
//     doc.text(`Semester: ${semester}`);
//     doc.text(`GPA: ${gpa}`);
//     doc.text(`Backlogs: ${backlogs}`);
//     doc.text(`Remarks: ${remarks}`);
//     doc.moveDown();

//     if (uploadedFiles.length > 0) {
//       doc.text('Uploaded Documents:');
//       uploadedFiles.forEach((file, i) => {
//         const filePath = path.join(__dirname, '../uploads', file);
//         if (fs.existsSync(filePath) && /\.(jpg|jpeg|png)$/i.test(file)) {
//           doc.addPage();
//           doc.image(filePath, { fit: [500, 400], align: 'center' });
//           doc.moveDown();
//           doc.text(`${i + 1}. ${file}`, { align: 'center' });
//         } else {
//           doc.text(`${i + 1}. ${file}`);
//         }
//       });
//     }

//     doc.end();

//     writeStream.on('finish', async () => {
//       await sendEmailWithAttachment(user.email, `Semester ${semester} Summary`, `Hi ${user.personalDetails.fullName},\n\nAttached is your semester summary.`, pdfPath);
//       res.json({ msg: 'Semester saved, PDF generated, and emailed successfully!', pdfUrl: `/uploads/${path.basename(pdfPath)}` });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.selectSemester = async (req, res) => {
//   try {
//     const { userId, semester } = req.body;

//     if (!userId || !semester) {
//       return res.status(400).json({ msg: 'userId and semester are required' });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const semNum = Number(semester);
//     if (user.currentSemester && semNum <= user.currentSemester) {
//       return res.status(400).json({ msg: `Cannot select semester ${semester}. Already completed or same.` });
//     }

//     user.currentSemester = semNum;
//     await user.save();

//     res.status(200).json({
//       msg: `Semester ${semester} unlocked. You can now submit academic details.`,
//       currentSemester: user.currentSemester
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

const User = require('../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ExcelJS = require('exceljs');
const { sendEmailWithAttachment } = require('../utils/emailService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/marksheets';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ msg: 'Too many files. Maximum 5 files allowed.' });
    }
  }
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ msg: 'Only image files are allowed.' });
  }
  next(err);
};

// ---------------------- Dashboard ----------------------
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Determine semester statuses
    const totalSemesters = 8; // adjust according to your course
    const semestersStatus = [];

    for (let i = 1; i <= totalSemesters; i++) {
      const academic = user.academicDetails.find(a => a.semester === i);
      if (academic) {
        semestersStatus.push({ semester: i, status: "editable" });
      } else if (i === user.currentSemester) {
        semestersStatus.push({ semester: i, status: "new" });
      } else {
        semestersStatus.push({ semester: i, status: "locked" });
      }
    }

    res.json({
      personalDetails: user.personalDetails,
      currentSemester: user.currentSemester,
      academicDetails: user.academicDetails,
      semestersStatus,
      isPersonalDetailsCompleted: user.isPersonalDetailsCompleted,
      isAcademicDetailsCompleted: user.isAcademicDetailsCompleted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------------- Personal Details ----------------------
exports.savePersonalDetails = async (req, res) => {
  try {
    const { userId, personalDetails } = req.body;
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (!personalDetails) {
      return res.status(400).json({ msg: 'Personal details are required' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Merge new personal details
    user.personalDetails = { 
      ...user.personalDetails, 
      ...personalDetails,
      isCompleted: true,
      completedAt: new Date()
    };
    user.isPersonalDetailsCompleted = true;
    
    await user.save();

    res.json({ msg: 'Personal details saved successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export upload middleware
exports.uploadMarksheets = upload.array('marksheets', 5); // Max 5 files
exports.handleUploadError = handleUploadError;

// ---------------------- Submit / Update Semester ----------------------
exports.submitSemester = async (req, res) => {
  try {
    const { userId, semester, gpa, backlogs, remarks } = req.body;
    const uploadedFiles = req.files ? req.files.map(f => f.path) : [];

    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (!semester) {
      return res.status(400).json({ msg: 'Semester is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const semNum = Number(semester);
    const existing = user.academicDetails.find(a => a.semester === semNum);

    if (existing) {
      // Update existing semester & append uploads
      existing.gpa = gpa;
      existing.backlogs = backlogs || 0;
      existing.remarks = remarks;
      existing.marksheetImages = [...existing.marksheetImages, ...uploadedFiles];
      existing.isCompleted = true;
      existing.completedAt = new Date();
    } else {
      // Add new semester
      user.academicDetails.push({
        semester: semNum,
        gpa,
        backlogs: backlogs || 0,
        remarks,
        marksheetImages: uploadedFiles,
        isCompleted: true,
        completedAt: new Date()
      });
    }

    // Update currentSemester if needed
    if (!user.currentSemester || semNum > user.currentSemester) {
      user.currentSemester = semNum;
    }

    // Check if all academic details are completed
    const completedSemesters = user.academicDetails.filter(ad => ad.isCompleted).length;
    user.isAcademicDetailsCompleted = completedSemesters > 0;

    await user.save();

    // ------------------- Generate PDF -------------------
    const pdfPath = path.join(__dirname, `../uploads/${user.enrollmentNo}_StudentDetails.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text('🎓 Student Academic Details', { align: 'center' });
    doc.moveDown();

    // Personal Details
    doc.fontSize(16).text('Personal Information:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${user.personalDetails.fullName || 'N/A'}`);
    doc.text(`Enrollment No: ${user.enrollmentNo}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Course: ${user.personalDetails.course || 'N/A'}`);
    doc.text(`Branch: ${user.personalDetails.branch || 'N/A'}`);
    doc.text(`10th Percentage: ${user.personalDetails.tenthPercentage || 'N/A'}`);
    doc.text(`Contact: ${user.personalDetails.contact || 'N/A'}`);
    doc.text(`DOB: ${user.personalDetails.dob || 'N/A'}`);
    doc.text(`Address: ${user.personalDetails.address || 'N/A'}`);
    doc.moveDown();

    // Academic Details
    doc.fontSize(16).text('Academic Information:', { underline: true });
    doc.fontSize(12);
    
    user.academicDetails.sort((a, b) => a.semester - b.semester).forEach((academic, index) => {
      doc.addPage();
      doc.fontSize(16).text(`Semester ${academic.semester}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`GPA: ${academic.gpa || 'N/A'}`);
      doc.text(`Backlogs: ${academic.backlogs || 0}`);
      doc.text(`Remarks: ${academic.remarks || 'N/A'}`);
      doc.moveDown();

      if (academic.marksheetImages && academic.marksheetImages.length > 0) {
        doc.text('Marksheet Images:');
        academic.marksheetImages.forEach((filePath, i) => {
          if (fs.existsSync(filePath) && /\.(jpg|jpeg|png)$/i.test(filePath)) {
            doc.addPage();
            doc.image(filePath, { fit: [500, 400], align: 'center' });
            doc.moveDown();
            doc.text(`Marksheet ${i + 1}`, { align: 'center' });
          }
        });
      }
    });

    doc.end();

    // ------------------- Send Email & Update Excel -------------------
    writeStream.on('finish', async () => {
      try {
        // Send email with PDF
        await sendEmailWithAttachment(
          user.email,
          `Student Portal - Your Academic Details`,
          `Hi ${user.personalDetails.fullName},\n\nPlease find your complete academic details attached.\n\nBest regards,\nStudent Portal Team`,
          pdfPath
        );

        // Update Excel file
        await updateAdminExcel(user);

        res.json({
          msg: 'Semester saved/updated, PDF generated, and emailed successfully!',
          pdfUrl: `/uploads/${path.basename(pdfPath)}`
        });
      } catch (emailErr) {
        console.error('Email error:', emailErr);
        res.json({
          msg: 'Semester saved/updated and PDF generated, but email failed to send.',
          pdfUrl: `/uploads/${path.basename(pdfPath)}`
        });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to update admin Excel
async function updateAdminExcel(user) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');
    
    // Add headers
    worksheet.columns = [
      { header: 'Enrollment No', key: 'enrollmentNo', width: 15 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Course', key: 'course', width: 15 },
      { header: 'Branch', key: 'branch', width: 15 },
      { header: 'Current Semester', key: 'currentSemester', width: 15 },
      { header: '10th %', key: 'tenthPercentage', width: 10 },
      { header: 'Contact', key: 'contact', width: 15 },
      { header: 'Last Updated', key: 'lastUpdated', width: 20 }
    ];

    // Add user data
    worksheet.addRow({
      enrollmentNo: user.enrollmentNo,
      name: user.personalDetails.fullName,
      email: user.email,
      course: user.personalDetails.course,
      branch: user.personalDetails.branch,
      currentSemester: user.currentSemester,
      tenthPercentage: user.personalDetails.tenthPercentage,
      contact: user.personalDetails.contact,
      lastUpdated: new Date().toLocaleDateString()
    });

    // Save Excel file
    const excelPath = 'uploads/admin-data.xlsx';
    await workbook.xlsx.writeFile(excelPath);
  } catch (err) {
    console.error('Excel update error:', err);
  }
}

// ---------------------- Select Semester ----------------------
exports.selectSemester = async (req, res) => {
  try {
    const { userId, semester } = req.body;

    if (!userId || !semester) {
      return res.status(400).json({ msg: 'userId and semester are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const semNum = Number(semester);

    if (user.currentSemester && semNum <= user.currentSemester) {
      return res.status(400).json({ msg: `Cannot select semester ${semester}. Already completed or same.` });
    }

    user.currentSemester = semNum;
    await user.save();

    res.status(200).json({
      msg: `Semester ${semester} unlocked. You can now submit academic details.`,
      currentSemester: user.currentSemester
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
