const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  let token;
  // Check cookie first (preferred), then header
  if (req.cookies && req.cookies.jwt) token = req.cookies.jwt;
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({ msg: "Not authorized, please login" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "student") {
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ msg: "User not found" });

      // Student Checks
      if (req.user.isPassOut)
        return res.status(403).json({ msg: "Tenure Expired" });

      // Check Ban/Suspend
      if (req.user.accountStatus?.status === "Banned") {
        return res.status(403).json({ msg: "Account Banned" });
      }
      if (req.user.accountStatus?.status === "Suspended") {
        const now = new Date();
        const until = req.user.accountStatus.suspendedUntil
          ? new Date(req.user.accountStatus.suspendedUntil)
          : null;
        if (until && now < until) {
          return res
            .status(403)
            .json({ msg: `Suspended until ${until.toLocaleDateString()}` });
        } else {
          // Auto-unsuspend logic handled in User Model pre-save, but redundant check here is safe
        }
      }
    } else {
      // Admin Logic
      req.user = await Admin.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ msg: "Admin not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token failed" });
  }
};

exports.superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "super-admin") next();
  else res.status(403).json({ msg: "Super Admin Only" });
};

exports.adminAccess = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "sub-admin" || req.user.role === "super-admin")
  )
    next();
  else res.status(403).json({ msg: "Admin Access Required" });
};
