const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema(
  {
    semester: { type: Number, required: true, min: 1, max: 10 },
    gpa: { type: Number, min: 0, max: 10 },
    backlogs: { type: Number, default: 0, min: 0 },
    remarks: String,
    marksheetImages: [String],
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
  },
  { _id: false }
);

const personalSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: String,
    contact: { type: String },
    address: String,
    tenthPercentage: { type: String },
    course: String,
    branch: String,
    profilePhoto: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    enrollmentNo: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    role: { type: String, default: "student" },

    // --- CRITICAL: Ban/Disable Logic Fields ---
    accountStatus: {
      isDisabled: { type: Boolean, default: false },
      disabledUntil: { type: Date },
      disabledBy: { type: String },
      disableReason: { type: String },
    },

    personalDetails: personalSchema,
    academicDetails: [academicSchema],
    currentSemester: { type: Number }, // Removed default: 1 to allow clean admins
    isPersonalDetailsCompleted: { type: Boolean, default: false },
    isAcademicDetailsCompleted: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
