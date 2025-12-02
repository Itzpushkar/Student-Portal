const User = require("../models/User");
const Admin = require("../models/Admin");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/OTPMailer");
const jwt = require("jsonwebtoken");

// Helper to generate token
const createSendToken = (user, statusCode, res, msg) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "lax",
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({ msg, user });
};

// --- SIGNUP ---
exports.signup = async (req, res) => {
  try {
    const { enrollmentNo, username, email, password, fullName } = req.body;

    if (!enrollmentNo || !username || !email || !password || !fullName) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }

    // --- FIX FOR ISSUE 1: STRICT CROSS-COLLECTION CHECKS ---

    // 1. Check Email Collision in ADMIN Collection
    // (We do NOT check username here, because same username is allowed across roles)
    const existingAdminEmail = await Admin.findOne({ email });
    if (existingAdminEmail) {
      return res.status(400).json({
        msg: "This Email is already registered as an Admin. Please use a different email.",
      });
    }

    // 2. Check Collision in STUDENT Collection
    // Here we check Email, Username, AND Enrollment because duplicates within Students are not allowed
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username },
        { enrollmentNo: enrollmentNo },
      ],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ msg: "This Email is already registered as a Student." });
      }
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ msg: "This Username is already taken by another Student." });
      }
      if (existingUser.enrollmentNo === enrollmentNo) {
        return res
          .status(400)
          .json({ msg: "This Enrollment Number is already registered." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear old pending requests
    await PendingUser.deleteMany({
      $or: [{ email }, { enrollmentNo }],
    });

    const newPendingUser = new PendingUser({
      enrollmentNo,
      username,
      email,
      password: hashedPassword,
      fullName,
      otp,
    });

    await newPendingUser.save();
    await sendOTP(email, otp);

    res.json({
      msg: "OTP sent to your email. Please check your inbox.",
      email,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res
      .status(500)
      .json({ msg: "Server error during signup", error: err.message });
  }
};

// --- VERIFY OTP ---
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res
        .status(400)
        .json({ msg: "OTP expired or invalid request. Sign up again." });
    }

    if (pendingUser.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const newUser = new User({
      enrollmentNo: pendingUser.enrollmentNo,
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      personalDetails: { fullName: pendingUser.fullName },
      role: "student",
      currentSemester: 1,
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    createSendToken(newUser, 200, res, "Verification successful!");
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ msg: "Server error during verification" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Ban Check
    if (user.accountStatus?.isDisabled) {
      const now = new Date();
      const until = user.accountStatus.disabledUntil
        ? new Date(user.accountStatus.disabledUntil)
        : null;

      if (!until || now < until) {
        return res.status(403).json({
          msg: "ACCOUNT_DISABLED",
          details: `Account banned. Reason: ${
            user.accountStatus.disableReason || "Admin Action"
          }`,
        });
      } else {
        // Auto-unban
        user.accountStatus.isDisabled = false;
        await user.save();
      }
    }

    user.lastLogin = Date.now();
    await user.save();

    createSendToken(user, 200, res, "Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
