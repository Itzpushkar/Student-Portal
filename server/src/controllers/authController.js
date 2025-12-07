const User = require("../models/User");
const Admin = require("../models/Admin");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/OTPMailer");
const jwt = require("jsonwebtoken");

// --- HELPER: JWT TOKEN ---
const createSendToken = (user, statusCode, res, msg, role = "student") => {
  const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "lax",
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({ msg, user, role });
};

// --- HELPER: CHECK EMAIL UNIQUENESS ---
const checkEmailExists = async (email) => {
  const student = await User.findOne({ email });
  const admin = await Admin.findOne({ email });
  return student || admin;
};

// ==============================
// 1. ADMIN AUTHENTICATION
// ==============================

exports.adminSignup = async (req, res) => {
  try {
    const { username, email, password, role, branch, post } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ msg: "Please fill all fields." });
    }

    if (await checkEmailExists(email)) {
      return res.status(400).json({ msg: "This Email ID is already in use." });
    }

    if (role === "super-admin") {
      const superAdminExists = await Admin.exists({ role: "super-admin" });
      if (superAdminExists) {
        return res.status(400).json({
          msg: "Super Admin already exists. You can only signup as Sub-Admin.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.deleteMany({ email });

    const newPending = new PendingUser({
      username,
      email,
      password: hashedPassword,
      role,
      branch,
      post,
      otp,
    });

    await newPending.save();

    try {
      await sendOTP(email, otp);
    } catch (e) {
      console.error("Email error:", e);
    }

    res.json({ msg: "OTP sent to email. Please verify.", email });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pending = await PendingUser.findOne({ email });

    if (!pending)
      return res.status(400).json({ msg: "Request expired or invalid." });
    if (pending.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    let isApproved = pending.role === "super-admin";

    const newAdmin = new Admin({
      username: pending.username,
      email: pending.email,
      password: pending.password,
      role: pending.role,
      branch: pending.branch || undefined,
      post: pending.post || undefined,
      isApproved: isApproved,
    });

    await newAdmin.save();
    await PendingUser.deleteOne({ email });

    if (isApproved) {
      createSendToken(newAdmin, 200, res, "Welcome Admin!", pending.role);
    } else {
      res.status(200).json({
        msg: "Your Admin Request has been sent for approval.",
        requireApproval: true,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password, role, branch } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: "User not found." });

    if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    if (admin.role !== role)
      return res
        .status(403)
        .json({ msg: `Access Denied: You are not a ${role}` });
    if (role === "sub-admin" && admin.branch !== branch)
      return res.status(403).json({ msg: "Incorrect branch." });

    if (!admin.isApproved) {
      return res
        .status(403)
        .json({ msg: "Account waiting for approval. Contact Super Admin." });
    }

    createSendToken(admin, 200, res, "Login Successful", admin.role);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// ==============================
// 2. STUDENT AUTHENTICATION
// ==============================

exports.signup = async (req, res) => {
  try {
    const { enrollmentNo, username, email, password, fullName } = req.body;

    if (await checkEmailExists(email))
      return res.status(400).json({ msg: "Email already in use." });

    const existingUser = await User.findOne({
      $or: [{ username }, { enrollmentNo }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "Username or Enrollment already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.deleteMany({ $or: [{ email }, { enrollmentNo }] });

    const newPending = new PendingUser({
      enrollmentNo,
      username,
      email,
      password: hashedPassword,
      fullName,
      otp,
      role: "student",
    });

    await newPending.save();
    try {
      await sendOTP(email, otp);
    } catch (e) {
      console.log("Email error", e);
    }

    res.json({ msg: "OTP sent.", email });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pending = await PendingUser.findOne({ email });

    if (!pending || pending.otp !== otp || pending.role !== "student") {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const newUser = new User({
      enrollmentNo: pending.enrollmentNo,
      username: pending.username,
      email: pending.email,
      password: pending.password,
      role: "student",
      personalDetails: { fullName: pending.fullName, branch: "Pending" },
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    createSendToken(newUser, 200, res, "Signup Successful", "student");
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, enrollmentNo } = req.body;

    const query = {
      $or: [
        { username: username },
        { enrollmentNo: username },
        ...(enrollmentNo ? [{ enrollmentNo }] : []),
      ],
    };

    const user = await User.findOne(query);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (user.accountStatus?.status === "Banned")
      return res.status(403).json({ msg: "Account BANNED." });
    if (user.accountStatus?.status === "Suspended") {
      return res.status(403).json({
        msg: `Suspended until ${new Date(
          user.accountStatus.suspendedUntil
        ).toLocaleDateString()}`,
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    createSendToken(user, 200, res, "Login Successful", "student");
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// ==============================
// 3. FORGOT PASSWORD (ADDED)
// ==============================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Check both tables
    const user = await User.findOne({ email });
    // Note: If you want admins to also reset passwords, check Admin table too.
    // For now assuming Student as per request.

    if (!user) return res.status(404).json({ msg: "Email not registered." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Use PendingUser with a special flag/role for Reset
    await PendingUser.deleteMany({ email, role: "reset" });
    const resetEntry = new PendingUser({
      username: user.username,
      email,
      password: "N/A", // Not needed for reset flow
      otp,
      role: "reset",
    });

    await resetEntry.save();

    try {
      await sendOTP(email, otp);
    } catch (e) {
      console.error("Email Error", e);
    }
    res.json({ msg: "Reset OTP sent to email." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pending = await PendingUser.findOne({ email, role: "reset" });

    if (!pending || pending.otp !== otp)
      return res.status(400).json({ msg: "Invalid or Expired OTP" });

    res.json({ msg: "OTP Verified", verified: true });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP again for security before changing password
    const pending = await PendingUser.findOne({ email, role: "reset" });
    if (!pending || pending.otp !== otp)
      return res
        .status(400)
        .json({ msg: "Session expired, please try again." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User Password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Cleanup
    await PendingUser.deleteMany({ email, role: "reset" });

    res.json({ msg: "Password Reset Successfully. Please Login." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// ==============================
// 4. CHANGE PASSWORD (LOGGED IN)
// ==============================

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Check if user exists (User ID comes from protect middleware)
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify Old Password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Incorrect old password." });

    // Hash & Save New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
