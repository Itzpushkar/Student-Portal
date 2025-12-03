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

    // Critical for filtering
    course: String,
    branch: { type: String, required: true },

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

    // --- TENURE LOGIC ---
    admissionYear: { type: Number, required: true }, // e.g., 2023
    courseDurationYears: { type: Number, default: 3 }, // Diploma = 3
    isPassOut: { type: Boolean, default: false }, // True if tenure is over

    // --- BAN LOGIC ---
    accountStatus: {
      isDisabled: { type: Boolean, default: false },
      disabledUntil: { type: Date },
      disabledBy: { type: String },
      disableReason: { type: String },
    },

    personalDetails: personalSchema,
    academicDetails: [academicSchema],
    currentSemester: { type: Number, default: 1 },
    isPersonalDetailsCompleted: { type: Boolean, default: false },
    isAcademicDetailsCompleted: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Middleware to auto-calculate PassOut status on save
userSchema.pre("save", function (next) {
  if (this.admissionYear && this.courseDurationYears) {
    const currentYear = new Date().getFullYear();
    // If current year is > admission + duration, they are passed out
    if (currentYear > this.admissionYear + this.courseDurationYears) {
      this.isPassOut = true;
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
