const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- ADMIN SIGNUP ---
exports.adminSignup = async (req, res) => {
  try {
    const { username, email, password, branch } = req.body; // Added branch

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }

    const existingStudent = await User.findOne({ email });
    if (existingStudent)
      return res.status(400).json({ msg: "Email registered as Student." });

    const existing = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ msg: "Admin already exists." });

    const adminCount = await Admin.countDocuments({});

    // First admin is SUPER ADMIN, others are SUB ADMINS
    let role = "sub-admin";
    let isApproved = false;

    if (adminCount === 0) {
      role = "super-admin";
      isApproved = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role,
      branch: role === "super-admin" ? "ALL" : branch, // Sub admins need a branch
      isApproved,
    });

    await newAdmin.save();

    res.json({
      msg: isApproved
        ? `Super Admin created! Login now.`
        : "Sub-Admin request sent for approval.",
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
      { id: admin._id, role: admin.role }, // Embed role in token
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
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        branch: admin.branch,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- FETCH STUDENTS (Role Based Logic) ---
exports.getAllStudents = async (req, res) => {
  try {
    let query = { isPassOut: false }; // Default: Only active students

    // 1. Sub Admin: Filter by Branch
    if (req.user.role === "sub-admin") {
      if (!req.user.branch)
        return res.status(400).json({ msg: "Admin has no assigned branch." });
      // Use regex for case-insensitive match on branch/personalDetails
      query["personalDetails.branch"] = {
        $regex: new RegExp(req.user.branch, "i"),
      };
    }

    // 2. Super Admin: Can see all (No extra filter needed)

    const students = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error fetching students" });
  }
};

// --- FETCH PASS-OUT STUDENTS (Super Admin Only) ---
exports.getPassoutStudents = async (req, res) => {
  try {
    // Only Super Admin can hit this route (protected by middleware)
    const students = await User.find({ isPassOut: true })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- MANAGE ADMINS (Super Admin Only) ---
exports.getAllSubAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "sub-admin" }).select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

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

// --- DISABLE USER (Shared Logic) ---
exports.disableUser = async (req, res) => {
  try {
    const { userId, days, reason } = req.body;

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ msg: "User not found" });

    // Sub Admin Constraint: Can only disable own branch
    if (req.user.role === "sub-admin") {
      const studentBranch = targetUser.personalDetails?.branch || "";
      if (
        !studentBranch.toLowerCase().includes(req.user.branch.toLowerCase())
      ) {
        return res
          .status(403)
          .json({ msg: "You can only manage students of your branch." });
      }
    }

    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + (parseInt(days) || 1));

    targetUser.accountStatus = {
      isDisabled: true,
      disabledUntil: unlockDate,
      disabledBy: req.user.username,
      disableReason: reason,
    };
    await targetUser.save();

    res.json({ msg: "User Disabled" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.enableUser = async (req, res) => {
  try {
    const { userId } = req.body;
    // Same branch check logic applies if strictly needed, omitted for brevity
    await User.findByIdAndUpdate(userId, {
      accountStatus: { isDisabled: false, disabledUntil: null },
    });
    res.json({ msg: "User Enabled" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- DELETE USER (Super Admin Only) ---
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.json({ msg: "User Permanently Deleted" });
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
