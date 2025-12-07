import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthProvider";

export default function StudentLoginForm({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  // States: 'login', 'forgot', 'verify-reset', 'reset-password'
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

  // Login Form
  const [form, setForm] = useState({ username: "", password: "" });

  // Forgot Password Forms
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        loginUser(data.user);
        navigate("/dashboard");
      } else {
        alert(data.msg || "Login Failed");
      }
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD HANDLERS ---
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert(data.msg);
        setView("verify-reset");
      } else {
        alert(data.msg || "Email not found");
      }
    } catch (e) {
      alert("Network Error");
    }
    setLoading(false);
  };

  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/verify-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail, otp: resetOtp }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setView("reset-password");
      } else {
        alert(data.msg || "Invalid OTP");
      }
    } catch (e) {
      alert("Verification Failed");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp, newPassword }),
      });

      if (res.ok) {
        alert("Password Reset Successfully! Please Login.");
        setView("login");
      } else {
        alert("Failed to reset password");
      }
    } catch (e) {
      alert("Error resetting password");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full justify-center">
      <button
        onClick={onClose}
        className="absolute top-8 left-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      {/* 1. LOGIN VIEW */}
      {view === "login" && (
        <>
          <h2 className="text-4xl font-bold text-indigo-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-slate-500 mb-8">Login to access your dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              className="pill-input"
              placeholder="Username / Enrollment No."
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              className="pill-input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center space-y-2">
              <p
                className="text-sm text-slate-500 cursor-pointer hover:text-indigo-600 font-medium"
                onClick={() => setView("forgot")}
              >
                Forgot Password?
              </p>
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <span
                  onClick={onSwitchToSignup}
                  className="text-green-600 font-bold cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </>
      )}

      {/* 2. FORGOT PASSWORD VIEW (Email) */}
      {view === "forgot" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
          <p className="text-slate-500 text-sm">
            Enter your registered email to receive an OTP.
          </p>
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <input
              className="pill-input"
              type="email"
              placeholder="Enter Registered Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button
              type="button"
              onClick={() => setView("login")}
              className="w-full text-slate-400 text-sm hover:text-slate-600 font-medium"
            >
              Back to Login
            </button>
          </form>
        </div>
      )}

      {/* 3. VERIFY OTP VIEW */}
      {view === "verify-reset" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800">Verify OTP</h2>
          <p className="text-slate-500 text-sm">
            Enter the 6-digit code sent to{" "}
            <span className="font-bold">{resetEmail}</span>
          </p>
          <form onSubmit={handleVerifyReset} className="space-y-4">
            <input
              className="pill-input text-center text-xl tracking-widest font-bold"
              placeholder="000000"
              maxLength={6}
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="w-full text-slate-400 text-sm hover:text-slate-600 font-medium"
            >
              Change Email
            </button>
          </form>
        </div>
      )}

      {/* 4. SET NEW PASSWORD VIEW */}
      {view === "reset-password" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800">New Password</h2>
          <p className="text-slate-500 text-sm">
            Create a new secure password.
          </p>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              className="pill-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition-all"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
