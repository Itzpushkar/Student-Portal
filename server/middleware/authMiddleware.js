const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.jwt) token = req.cookies.jwt;

  if (!token)
    return res.status(401).json({ msg: "Not authorized, please login" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role.includes("admin")) {
      req.user = await Admin.findById(decoded.id).select("-password");
      req.user.roleType = "admin"; // Custom flag for easy checking
    } else {
      req.user = await User.findById(decoded.id).select("-password");
      req.user.roleType = "student";

      // --- STUDENT TENURE CHECK ---
      if (req.user.isPassOut) {
        return res.status(403).json({
          msg: "TENURE_EXPIRED",
          details: "Your course tenure has ended. Access restricted.",
        });
      }

      // --- BAN CHECK LOGIC ---
      if (req.user.accountStatus && req.user.accountStatus.isDisabled) {
        const now = new Date();
        const until = req.user.accountStatus.disabledUntil
          ? new Date(req.user.accountStatus.disabledUntil)
          : null;

        if (!until || now < until) {
          return res.status(403).json({
            msg: "ACCOUNT_DISABLED",
            details: `Disabled by ${req.user.accountStatus.disabledBy}: ${req.user.accountStatus.disableReason}`,
          });
        } else {
          // Auto-unban
          req.user.accountStatus.isDisabled = false;
          await req.user.save();
        }
      }
    }

    if (!req.user) return res.status(401).json({ msg: "User not found" });

    next();
  } catch (err) {
    res.status(401).json({ msg: "Not authorized, token failed" });
  }
};

// 1. Super Admin Only (Full Access)
exports.superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "super-admin") {
    next();
  } else {
    res.status(403).json({ msg: "Super Admin access required" });
  }
};

// 2. Sub Admin (Branch Restricted) OR Super Admin
exports.adminAccess = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "sub-admin" || req.user.role === "super-admin")
  ) {
    next();
  } else {
    res.status(403).json({ msg: "Admin access required" });
  }
};
