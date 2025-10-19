const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  gpa: String,
  backlogs: { type: Number, default: 0 },
  remarks: String,
  marksheetImages: [String], // Array of file paths for marksheet images
  isCompleted: { type: Boolean, default: false },
  completedAt: Date
}, { _id: false });

const personalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: String,
  contact: String,
  address: String,
  tenthPercentage: String,
  course: String,
  branch: String,
  profilePhoto: String,
  isCompleted: { type: Boolean, default: false },
  completedAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
  enrollmentNo: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  otp: String,
  isVerified: { type: Boolean, default: false },
  personalDetails: personalSchema,
  academicDetails: [academicSchema],
  currentSemester: { type: Number, default: 1 },
  isPersonalDetailsCompleted: { type: Boolean, default: false },
  isAcademicDetailsCompleted: { type: Boolean, default: false },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
