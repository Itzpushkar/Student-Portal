const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Admin Hierarchy Logic
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String }, // Name of admin who approved this account

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
