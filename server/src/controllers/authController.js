const User = require("../models/User");
const Admin = require("../models/Admin");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/OTPMailer");
const jwt = require("jsonwebtoken");

const createSendToken = (user, statusCode, res, msg, role = "student") => {
  const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({ msg, user, role });
};

const checkEmailExists = async (email) => {
  const student = await User.findOne({ email });
  const admin = await Admin.findOne({ email });
  return student || admin;
};

// ... (Admin Logic Omitted - assume it is unchanged) ...
exports.adminSignup = async (req, res) => {
  /* ... existing code ... */
};
exports.verifyAdminOTP = async (req, res) => {
  /* ... existing code ... */
};
exports.adminLogin = async (req, res) => {
  /* ... existing code ... */
};

// ==============================
// 2. STUDENT AUTHENTICATION
// ==============================

exports.signup = async (req, res) => {
  try {
    // ADDED: branch in destructuring
    const { enrollmentNo, username, email, password, fullName, branch } =
      req.body;

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
      branch, // Store branch temporarily
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
      // ADDED: Initialize branch in personalDetails
      personalDetails: {
        fullName: pending.fullName,
        branch: pending.branch || "Pending",
      },
      isPersonalDetailsCompleted: false,
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
      return res
        .status(403)
        .json({
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
