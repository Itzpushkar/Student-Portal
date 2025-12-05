const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Security Packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Load environment variables
dotenv.config();

// --- INITIALIZE APP ---
const app = express();

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5175",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// ==========================================
// 2. SECURITY MIDDLEWARE
// ==========================================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in 15 minutes!",
});
app.use("/api", limiter);

// ==========================================
// 3. STANDARD MIDDLEWARE
// ==========================================
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Safe Sanitization Middleware
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  try {
    if (req.query) mongoSanitize.sanitize(req.query);
  } catch (err) {
    // Ignore read-only query property error in newer Node versions
  }
  next();
});

// Serve Static Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// 4. DATABASE CONNECTION
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_portal";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ==========================================
// 5. ROUTES
// ==========================================
app.get("/", (req, res) => res.send("Student Portal Backend is Running..."));

// FIX: Updated path to point to src/routes
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// Register Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    msg: "Internal Server Error",
    error: err.message,
  });
});

// ==========================================
// 6. START SERVER
// ==========================================
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
