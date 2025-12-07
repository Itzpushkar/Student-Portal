const User = require("../models/User");
const Admin = require("../models/Admin");
const sendEmail = require("../utils/sendEmail");

// --- CHECKS ---
exports.checkSuperAdmin = async (req, res) => {
  try {
    const exists = await Admin.exists({ role: "super-admin" });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

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
    if (year) query.admissionYear = parseInt(year) - 4;

    const students = await User.find(query).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- ACTIONS ---

exports.approveAdmin = async (req, res) => {
  try {
    // 1. Update the Admin status
    const admin = await Admin.findByIdAndUpdate(
      req.body.adminId,
      { isApproved: true },
      { new: true }
    );

    if (admin) {
      // 2. Send Approval Email
      const subject = "Admin Request Approved - Student Portal";
      const text = `Congratulations ${admin.username},\n\nYour request to become a Sub-Admin has been approved by the Super Admin.\n\nYou can now login to your dashboard using your credentials.\n\nRegards,\nAdmin Team`;

      try {
        await sendEmail(admin.email, subject, text);
      } catch (emailErr) {
        console.error("Failed to send approval email:", emailErr);
        // We don't block the response if email fails, but log it
      }
    }

    res.json({ msg: "Admin Approved & Email Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error approving admin" });
  }
};

exports.rejectAdminRequest = async (req, res) => {
  try {
    const admin = await Admin.findById(req.body.adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const userEmail = admin.email;
    const userName = admin.username;

    // 1. Delete the Admin record
    await Admin.findByIdAndDelete(req.body.adminId);

    // 2. Send Rejection Email
    const subject = "Admin Request Rejected - Student Portal";
    const text = `Hello ${userName},\n\nYour request to become a Sub-Admin has been rejected by the Super Admin.\n\nPlease contact the administration for more details.\n\nRegards,\nAdmin Team`;

    try {
      await sendEmail(userEmail, subject, text);
    } catch (emailErr) {
      console.error("Failed to send rejection email:", emailErr);
    }

    res.json({ msg: "Request Rejected & Email Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error rejecting request" });
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
    res.json({ msg: "Status Updated", status: user.accountStatus.status });
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
  res.json([]);
};
