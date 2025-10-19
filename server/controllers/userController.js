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
const { sendEmailWithAttachment } = require('../utils/emailService');

// ---------------------- Dashboard ----------------------
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.body;
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
      semestersStatus
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
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Merge new personal details
    user.personalDetails = { ...user.personalDetails, ...personalDetails };
    await user.save();

    res.json({ msg: 'Personal details saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------------- Submit / Update Semester ----------------------
exports.submitSemester = async (req, res) => {
  try {
    const { userId, semester, gpa, backlogs, remarks } = req.body;
    const uploadedFiles = req.files ? req.files.map(f => f.filename) : [];

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const semNum = Number(semester);
    const existing = user.academicDetails.find(a => a.semester === semNum);

    if (existing) {
      // Update existing semester & append uploads
      existing.gpa = gpa;
      existing.backlogs = backlogs;
      existing.remarks = remarks;
      existing.uploads = [...existing.uploads, ...uploadedFiles];
    } else {
      // Add new semester
      user.academicDetails.push({
        semester: semNum,
        gpa,
        backlogs,
        remarks,
        uploads: uploadedFiles,
      });
    }

    // Update currentSemester if needed
    if (!user.currentSemester || semNum > user.currentSemester) {
      user.currentSemester = semNum;
    }

    await user.save();

    // ------------------- Generate PDF -------------------
    const pdfPath = path.join(__dirname, `../uploads/${user.personalDetails.fullName}_Semester${semNum}_Summary.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('🎓 Student Semester Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${user.personalDetails.fullName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Current Semester: ${user.currentSemester}`);
    doc.moveDown();

    // Include all semesters
    user.academicDetails.sort((a, b) => a.semester - b.semester).forEach(sem => {
      doc.addPage();
      doc.fontSize(16).text(`Semester ${sem.semester}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`GPA: ${sem.gpa}`);
      doc.text(`Backlogs: ${sem.backlogs}`);
      doc.text(`Remarks: ${sem.remarks}`);
      doc.moveDown();

      if (sem.uploads.length > 0) {
        doc.text('Uploaded Documents / Marksheets:');
        sem.uploads.forEach((file, i) => {
          const filePath = path.join(__dirname, '../uploads', file);
          if (fs.existsSync(filePath) && /\.(jpg|jpeg|png)$/i.test(file)) {
            doc.addPage();
            doc.image(filePath, { fit: [500, 400], align: 'center' });
            doc.moveDown();
            doc.text(`${i + 1}. ${file}`, { align: 'center' });
          } else {
            doc.text(`${i + 1}. ${file}`);
          }
        });
      }
    });

    doc.end();

    // ------------------- Send Email -------------------
    writeStream.on('finish', async () => {
      await sendEmailWithAttachment(
        user.email,
        `Semester ${semNum} Summary`,
        `Hi ${user.personalDetails.fullName},\n\nAttached is your semester summary including all semesters filled so far.`,
        pdfPath
      );

      res.json({
        msg: 'Semester saved/updated, PDF generated, and emailed successfully!',
        pdfUrl: `/uploads/${path.basename(pdfPath)}`
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

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
