const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Role Structure
  role: {
    type: String,
    enum: ["super-admin", "sub-admin"],
    default: "sub-admin",
  },

  // For Sub Admins: Which branch do they manage? (e.g., "Computer", "Mechanical")
  // Super Admin will have this as null or "ALL"
  branch: { type: String },

  // Hierarchy Logic
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
