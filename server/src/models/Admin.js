const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["super-admin", "sub-admin"],
    default: "sub-admin",
  },

  // Only for Sub-Admins
  branch: { type: String },
  post: {
    type: String,
    enum: ["HOD", "Proctor/Mentor", "Class Counsellor", "Other"],
    default: "Other",
  },

  isApproved: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
