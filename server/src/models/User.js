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
    // FIX: Added tenthPercentage field
    tenthPercentage: { type: String },
    course: String,
    branch: { type: String, required: true },
    profilePhoto: String,
    isCompleted: { type: Boolean, default: false },
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

    admissionYear: { type: Number }, // Required for pass-out logic
    courseDurationYears: { type: Number, default: 4 },
    isPassOut: { type: Boolean, default: false },

    // --- ACCOUNT STATUS ---
    accountStatus: {
      status: {
        type: String,
        enum: ["Active", "Banned", "Suspended"],
        default: "Active",
      },
      // Suspension details
      suspendedUntil: { type: Date },
      suspendReason: { type: String },
      // Ban details
      bannedBy: { type: String }, // Admin Username
    },

    personalDetails: personalSchema,
    academicDetails: [academicSchema],
    currentSemester: { type: Number, default: 1 },

    // FIX: Added completion flags to root schema
    isPersonalDetailsCompleted: { type: Boolean, default: false },
    isAcademicDetailsCompleted: { type: Boolean, default: false },

    lastLogin: Date,
  },
  { timestamps: true }
);

// Auto-Passout & Auto-Unsuspend Middleware
userSchema.pre("save", function (next) {
  // 1. Check for Pass-out status
  if (this.admissionYear) {
    const currentYear = new Date().getFullYear();
    if (currentYear >= this.admissionYear + this.courseDurationYears) {
      this.isPassOut = true;
    }
  }

  // 2. Check for Auto-Unsuspend
  if (
    this.accountStatus.status === "Suspended" &&
    this.accountStatus.suspendedUntil
  ) {
    if (new Date() > this.accountStatus.suspendedUntil) {
      this.accountStatus.status = "Active";
      this.accountStatus.suspendedUntil = null;
      this.accountStatus.suspendReason = null;
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
