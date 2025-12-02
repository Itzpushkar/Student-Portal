const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- ADMIN SIGNUP ---
exports.adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }

    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: "Email registered as Student." });
    }

    const existing = await Admin.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existing) {
      return res.status(400).json({ msg: "Admin already exists." });
    }

    const adminCount = await Admin.countDocuments({});
    let isApproved = adminCount === 0; // First admin is auto-approved

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      isApproved,
    });

    await newAdmin.save();

    res.json({
      msg: isApproved
        ? "Admin created! Login now."
        : "Request sent for approval.",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- ADMIN LOGIN ---
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select("+password");

    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });
    if (!admin.isApproved)
      return res.status(403).json({ msg: "Account pending approval." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      msg: "Login Successful",
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- GET ALL STUDENTS (Fix for Students Tab) ---
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Get All Students Error:", err);
    res.status(500).json({ msg: "Server Error fetching students" });
  }
};

// --- MANAGE ADMINS ---
exports.approveAdmin = async (req, res) => {
  try {
    const { pendingAdminId, decision } = req.body;
    if (decision === "approve") {
      await Admin.findByIdAndUpdate(pendingAdminId, {
        isApproved: true,
        approvedBy: req.user.username,
      });
      res.json({ msg: "Admin Approved" });
    } else {
      await Admin.findByIdAndDelete(pendingAdminId);
      res.json({ msg: "Admin Rejected" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getPendingAdmins = async (req, res) => {
  try {
    const pending = await Admin.find({ isApproved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- MANAGE USERS (Ban/Unban) ---
exports.disableUser = async (req, res) => {
  try {
    const { userId, days, reason } = req.body;
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + (parseInt(days) || 1));

    await User.findByIdAndUpdate(userId, {
      accountStatus: {
        isDisabled: true,
        disabledUntil: unlockDate,
        disabledBy: req.user.username,
        disableReason: reason,
      },
    });
    res.json({ msg: "User Disabled" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.enableUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, {
      accountStatus: { isDisabled: false, disabledUntil: null },
    });
    res.json({ msg: "User Enabled" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
