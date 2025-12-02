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

    if (decoded.role === "admin") {
      req.user = await Admin.findById(decoded.id).select("-password");
    } else {
      req.user = await User.findById(decoded.id).select("-password");

      // --- BAN CHECK LOGIC ---
      if (
        req.user &&
        req.user.accountStatus &&
        req.user.accountStatus.isDisabled
      ) {
        const now = new Date();
        const until = req.user.accountStatus.disabledUntil
          ? new Date(req.user.accountStatus.disabledUntil)
          : null;

        // If banned indefinitely OR time hasn't passed yet
        if (!until || now < until) {
          return res.status(403).json({
            msg: "ACCOUNT_DISABLED",
            details: `Your account is disabled by ${
              req.user.accountStatus.disabledBy
            }. Reason: ${
              req.user.accountStatus.disableReason || "Admin Action"
            }.`,
          });
        } else {
          // Auto-unban if time expired
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

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.isApproved !== undefined) {
    next();
  } else {
    res.status(403).json({ msg: "Admin access required" });
  }
};
