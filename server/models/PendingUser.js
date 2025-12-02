const mongoose = require("mongoose");

// PHASE 2: Temporary storage for unverified users
// This prevents 'ghost' accounts from blocking emails/usernames if OTP isn't verified.
const pendingUserSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Hashed password
  fullName: { type: String, required: true },
  otp: { type: String, required: true },

  // TTL Index: Document automatically deletes itself after 600 seconds (10 minutes)
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
