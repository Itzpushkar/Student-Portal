const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  semester: Number,
  gpa: String,
  backlogs: Number,
  remarks: String,
  uploads: [String],
}, { _id: false });

const personalSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  contact: String,
  address: String,
  tenthPercentage: String,
  course: String,
  profilePhoto: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  enrollmentNo: { type: String, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
  personalDetails: personalSchema,
  academicDetails: [academicSchema],
  currentSemester: Number
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
