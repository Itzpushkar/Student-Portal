// const User = require("../models/User");
// const Admin = require("../models/Admin");
// const PendingUser = require("../models/PendingUser");
// const bcrypt = require("bcryptjs");
// const sendOTP = require("../utils/OTPMailer");
// const jwt = require("jsonwebtoken");

// // --- HELPER: JWT TOKEN ---
// const createSendToken = (user, statusCode, res, msg, role = "student") => {
//   const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });

//   const cookieOptions = {
//     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: false, // Set to true in production
//     sameSite: "lax",
//   };

//   res.cookie("jwt", token, cookieOptions);
//   user.password = undefined;

//   res.status(statusCode).json({ msg, user, role });
// };

// // ==============================
// // 1. ADMIN AUTHENTICATION
// // ==============================

// exports.adminSignup = async (req, res) => {
//   try {
//     const { username, email, password, role, branch, post } = req.body;

//     if (!username || !email || !password || !role) {
//       return res.status(400).json({ msg: "Please fill all fields." });
//     }

//     const existingAdmin = await Admin.findOne({
//       $or: [{ email }, { username }],
//     });
//     if (existingAdmin)
//       return res.status(400).json({ msg: "Admin already exists." });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await PendingUser.deleteMany({ email });

//     const newPending = new PendingUser({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       branch,
//       post,
//       otp,
//     });

//     await newPending.save();

//     try {
//       await sendOTP(email, otp);
//     } catch (e) {
//       console.log("Email error", e);
//     }

//     res.json({ msg: "OTP sent to email. Please verify.", email });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// exports.verifyAdminOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const pending = await PendingUser.findOne({ email });

//     if (!pending || pending.otp !== otp)
//       return res.status(400).json({ msg: "Invalid OTP" });

//     // Auto-approve first admin
//     const count = await Admin.countDocuments();
//     let isApproved = count === 0 || pending.role === "super-admin";
//     let finalRole = count === 0 ? "super-admin" : pending.role;

//     const newAdmin = new Admin({
//       username: pending.username,
//       email: pending.email,
//       password: pending.password,
//       role: finalRole,
//       // Fix: Convert null to undefined to avoid Enum Validation Errors
//       branch: pending.branch || undefined,
//       post: pending.post || undefined,
//       isApproved: isApproved,
//     });

//     await newAdmin.save();
//     await PendingUser.deleteOne({ email });

//     if (isApproved) {
//       createSendToken(newAdmin, 200, res, "Welcome Admin!", finalRole);
//     } else {
//       res
//         .status(200)
//         .json({
//           msg: "Request sent. Wait for approval.",
//           requireApproval: true,
//         });
//     }
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// exports.adminLogin = async (req, res) => {
//   try {
//     const { username, password, role, branch } = req.body;

//     const admin = await Admin.findOne({ username });
//     if (!admin) return res.status(400).json({ msg: "User not found." });

//     if (!(await bcrypt.compare(password, admin.password))) {
//       return res.status(400).json({ msg: "Invalid credentials." });
//     }

//     if (admin.role !== role)
//       return res
//         .status(403)
//         .json({ msg: `Access Denied: You are not a ${role}` });
//     if (role === "sub-admin" && admin.branch !== branch)
//       return res.status(403).json({ msg: "Incorrect branch." });
//     if (!admin.isApproved)
//       return res.status(403).json({ msg: "Account pending approval." });

//     createSendToken(admin, 200, res, "Login Successful", admin.role);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// // ==============================
// // 2. STUDENT AUTHENTICATION
// // ==============================

// exports.signup = async (req, res) => {
//   try {
//     const { enrollmentNo, username, email, password, fullName } = req.body;

//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }, { enrollmentNo }],
//     });
//     if (existingUser)
//       return res.status(400).json({ msg: "User details already exist." });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await PendingUser.deleteMany({ $or: [{ email }, { enrollmentNo }] });

//     const newPending = new PendingUser({
//       enrollmentNo,
//       username,
//       email,
//       password: hashedPassword,
//       fullName,
//       otp,
//       role: "student",
//     });

//     await newPending.save();
//     try {
//       await sendOTP(email, otp);
//     } catch (e) {
//       console.log("Email error", e);
//     }

//     res.json({ msg: "OTP sent.", email });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const pending = await PendingUser.findOne({ email });

//     if (!pending || pending.otp !== otp || pending.role !== "student") {
//       return res.status(400).json({ msg: "Invalid OTP" });
//     }

//     const newUser = new User({
//       enrollmentNo: pending.enrollmentNo,
//       username: pending.username,
//       email: pending.email,
//       password: pending.password,
//       role: "student",
//       personalDetails: { fullName: pending.fullName, branch: "Pending" },
//     });

//     await newUser.save();
//     await PendingUser.deleteOne({ email });

//     createSendToken(newUser, 200, res, "Signup Successful", "student");
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { username, password, enrollmentNo } = req.body;

//     // FIX: Search for the input in BOTH username AND enrollmentNo fields
//     // This handles cases where user types enrollment number in the "username" field
//     const query = {
//       $or: [
//         { username: username },
//         { enrollmentNo: username },
//         // Keep this just in case specific enrollmentNo field is passed
//         ...(enrollmentNo ? [{ enrollmentNo }] : []),
//       ],
//     };

//     const user = await User.findOne(query);

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     if (user.accountStatus?.status === "Banned")
//       return res.status(403).json({ msg: "Account BANNED." });
//     if (user.accountStatus?.status === "Suspended") {
//       return res
//         .status(403)
//         .json({
//           msg: `Suspended until ${new Date(
//             user.accountStatus.suspendedUntil
//           ).toLocaleDateString()}`,
//         });
//     }

//     user.lastLogin = Date.now();
//     await user.save();

//     createSendToken(user, 200, res, "Login Successful", "student");
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// exports.logout = (req, res) => {
//   res.cookie("jwt", "loggedout", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });
//   res.status(200).json({ status: "success" });
// };

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

// --- HELPER: CHECK UNIQUE EMAIL ---
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

    // 1. Global Email Check
    if (await checkEmailExists(email)) {
      return res
        .status(400)
        .json({ msg: "This Email ID is already registered." });
    }

    // 2. Admin Username Check
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin)
      return res.status(400).json({ msg: "Username already taken." });

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
      console.log("Email error", e);
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

    if (!pending || pending.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    const count = await Admin.countDocuments();
    let isApproved = count === 0 || pending.role === "super-admin";
    let finalRole = count === 0 ? "super-admin" : pending.role;

    const newAdmin = new Admin({
      username: pending.username,
      email: pending.email,
      password: pending.password,
      role: finalRole,
      branch: pending.branch || undefined,
      post: pending.post || undefined,
      isApproved: isApproved,
    });

    await newAdmin.save();
    await PendingUser.deleteOne({ email });

    if (isApproved) {
      createSendToken(newAdmin, 200, res, "Welcome Admin!", finalRole);
    } else {
      res
        .status(200)
        .json({
          msg: "Request sent. Wait for approval.",
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
    if (!admin.isApproved)
      return res.status(403).json({ msg: "Account pending approval." });

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

    // 1. Global Email Check
    if (await checkEmailExists(email)) {
      return res
        .status(400)
        .json({ msg: "This Email ID is already registered." });
    }

    // 2. Student Specific Checks
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

    // Allow login by Username OR Enrollment
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
