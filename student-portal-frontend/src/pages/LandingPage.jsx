import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // UI State for flipping between Signup Form and OTP Form
  const [showOtpView, setShowOtpView] = useState(false);
  const [otp, setOtp] = useState("");

  // Login State
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Signup State
  const [signupForm, setSignupForm] = useState({
    enrollmentNo: "",
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const toggleBook = () => {
    setIsBookOpen(!isBookOpen);
    // Reset views when closing/opening
    if (isBookOpen) {
      setTimeout(() => setShowOtpView(false), 500);
    }
  };

  // --- HANDLE STUDENT LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for Cookies
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok) {
        loginUser(data.user);
        navigate("/dashboard");
      } else {
        alert(data.msg || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error during Login");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE STUDENT SIGNUP ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await res.json();

      if (res.ok) {
        // SUCCESS: Switch to OTP View inside the book
        setShowOtpView(true);
        alert(data.msg || "OTP sent to your email!");
      } else {
        alert(data.msg || "Signup Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error during Signup");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE OTP VERIFICATION ---
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: This sets the JWT cookie
        body: JSON.stringify({
          email: signupForm.email,
          otp: otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Login immediately after verification
        loginUser(data.user);
        alert("Verification Successful!");
        navigate("/dashboard");
      } else {
        alert(data.msg || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed due to network error");
    } finally {
      setLoading(false);
    }
  };

  // --- ADMIN PORTAL SHORTCUT (FIXED) ---
  const handleSecretAdminAccess = (e) => {
    // FIX: Changed to detail === 2 for DOUBLE CLICK
    if (e.detail === 2) {
      // Use setTimeout to allow the click event to finish bubbling
      setTimeout(() => {
        const action = window.prompt(
          "🔐 Admin Portal: Type 'login' or 'signup'"
        );
        if (action === "login") navigate("/admin-login");
        if (action === "signup") navigate("/admin-signup");
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-800">
      {/* Navbar */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={handleSecretAdminAccess}
          title="Double click for Admin Access"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            🎓
          </div>
          <span className="text-xl font-bold text-slate-800">
            Student<span className="text-indigo-600">Portal</span>
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Text */}
        <div
          className={`flex-1 transition-all duration-700 ${
            isBookOpen
              ? "opacity-0 pointer-events-none transform -translate-x-10"
              : "opacity-100"
          }`}
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            Your Academic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Gateway
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Access grades, manage semesters, and track progress in one unified,
            secure portal.
          </p>
          <button
            onClick={toggleBook}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1"
          >
            Access Portal
          </button>
        </div>

        {/* 3D Book Container */}
        <div
          className={`flex-1 flex justify-center perspective-1000 w-full transition-all duration-700 ${
            isBookOpen ? "lg:-translate-x-[50%]" : ""
          }`}
        >
          <div
            className={`relative w-[400px] h-[600px] transition-transform duration-700 transform-style-3d ${
              isBookOpen ? "rotate-y-180" : ""
            }`}
          >
            {/* --- BOOK FRONT (LOGIN) --- */}
            <div className="absolute inset-0 bg-white rounded-r-3xl rounded-l-lg shadow-2xl border-l-[12px] border-indigo-900 z-20 backface-hidden p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Student Login
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                Enter your credentials to access the dashboard.
              </p>

              <form className="space-y-5" onSubmit={handleLogin}>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="Username"
                  required
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="Password"
                  required
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
                <button
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                >
                  {loading ? "Verifying..." : "Log In"}
                </button>
              </form>

              <div className="mt-8 text-center pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500">New Student?</p>
                <button
                  onClick={toggleBook}
                  className="text-indigo-600 font-bold hover:underline text-sm"
                >
                  Create Account →
                </button>
              </div>
            </div>

            {/* --- BOOK BACK (REGISTER / OTP) --- */}
            <div className="absolute inset-0 bg-white rounded-l-3xl rounded-r-lg shadow-2xl border-r-[12px] border-indigo-900 z-10 backface-hidden rotate-y-180 p-8 flex flex-col justify-center overflow-y-auto">
              {/* CONDITIONAL RENDERING: Registration OR OTP */}
              {!showOtpView ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Registration
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Create your student profile.
                  </p>

                  <form className="space-y-4" onSubmit={handleSignup}>
                    <input
                      className="input-field"
                      placeholder="Full Name"
                      required
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          fullName: e.target.value,
                        })
                      }
                    />
                    <input
                      className="input-field"
                      placeholder="Enrollment No"
                      required
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          enrollmentNo: e.target.value,
                        })
                      }
                    />
                    <input
                      className="input-field"
                      placeholder="Username"
                      required
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          username: e.target.value,
                        })
                      }
                    />
                    <input
                      className="input-field"
                      type="email"
                      placeholder="Email"
                      required
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                    />
                    <input
                      className="input-field"
                      type="password"
                      placeholder="Password"
                      required
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                    />

                    <button
                      disabled={loading}
                      className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                    >
                      {loading ? "Sending OTP..." : "Sign Up"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      📧
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">
                      Verify Email
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Enter the OTP sent to <strong>{signupForm.email}</strong>
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleVerify}>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-center text-2xl tracking-widest font-bold"
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                      disabled={loading}
                      className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all"
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>
                  </form>

                  <button
                    onClick={() => setShowOtpView(false)}
                    className="mt-6 text-sm text-slate-400 hover:text-slate-600 w-full text-center"
                  >
                    ← Wrong Email? Go Back
                  </button>
                </>
              )}

              {!showOtpView && (
                <button
                  onClick={toggleBook}
                  className="mt-6 text-slate-400 hover:text-slate-600 text-sm"
                >
                  ← Back to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(-180deg); }
        .input-field { width: 100%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; outline: none; transition: 0.2s; }
        .input-field:focus { border-color: #4f46e5; background: white; }
      `}</style>
    </div>
  );
}
