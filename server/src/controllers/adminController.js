const User = require("../models/User");
const Admin = require("../models/Admin");

// --- FETCH DATA ---

exports.getPendingAdmins = async (req, res) => {
  try {
    const pending = await Admin.find({ isApproved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getAllSubAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "sub-admin", isApproved: true });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const { branch, semester, year } = req.query;
    let query = { role: "student", isPassOut: false };

    if (branch) query["personalDetails.branch"] = branch;
    if (semester) query.currentSemester = semester;
    // Optional year filter if passed
    if (year) query.admissionYear = parseInt(year);

    const students = await User.find(query).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getPassoutStudents = async (req, res) => {
  try {
    const { branch, year } = req.query;
    let query = { role: "student", isPassOut: true };
    if (branch) query["personalDetails.branch"] = branch;
    if (year) query.admissionYear = parseInt(year) - 4; // Approx logic

    const students = await User.find(query).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- ACTIONS ---

exports.approveAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.body.adminId, { isApproved: true });
    res.json({ msg: "Admin Approved" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.rejectAdminRequest = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.body.adminId);
    res.json({ msg: "Request Rejected" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.accountStatus.status === "Banned") {
      user.accountStatus.status = "Active";
      user.accountStatus.bannedBy = null;
    } else {
      user.accountStatus.status = "Banned";
      user.accountStatus.bannedBy = req.user.username;
    }
    await user.save();
    res.json({ msg: "Status Updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId, duration, reason } = req.body;
    const user = await User.findById(userId);
    let suspendedUntil = null;

    if (duration !== "Until I unsuspend") {
      const days = duration.includes("Day") ? parseInt(duration) : 7;
      suspendedUntil = new Date();
      suspendedUntil.setDate(suspendedUntil.getDate() + days);
    }

    user.accountStatus = {
      status: "Suspended",
      suspendedUntil,
      suspendReason: reason,
      bannedBy: req.user.username,
    };
    await user.save();
    res.json({ msg: "User Suspended" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

exports.getActivities = async (req, res) => {
  res.json([]); // Placeholder
};
