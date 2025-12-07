const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  // Common fields
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 mins expiry

  // Student specific
  enrollmentNo: { type: String },
  fullName: { type: String },
  branch: { type: String }, // ADDED: To store branch during signup

  // Admin specific
  role: { type: String, default: "student" },
  post: { type: String },
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
