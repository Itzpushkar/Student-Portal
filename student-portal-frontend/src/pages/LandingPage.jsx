import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// --- INLINE ICONS ---
const IconGraduationCap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 0 6 0 9 5 0-5 3-5 9-5v-5" />
  </svg>
);
const IconLogIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);
const IconUserPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" x2="20" y1="8" y2="14" />
    <line x1="23" x2="17" y1="11" y2="11" />
  </svg>
);
const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [viewState, setViewState] = useState("default");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    enrollmentNo: "",
    username: "",
    email: "",
    password: "",
  });

  // FIX: Added 'branch' to admin form state
  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
    branch: "",
  });

  // --- HANDLERS ---

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        loginUser(data.user);
        navigate("/dashboard");
      } else alert(data.msg || "Login Failed");
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignup = async (e) => {
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
        alert(
          "Signup Successful! Check email for OTP (Simulated). Login to continue."
        );
        setViewState("login-slide");
      } else alert(data.msg || "Signup Failed");
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: adminForm.username,
          password: adminForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // IMPORTANT: Ensure the backend returns the role!
        loginUser({ ...data.admin, role: data.admin.role });
        navigate("/admin");
      } else alert(data.msg);
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    if (!adminForm.branch) {
      alert("Please select a branch.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      alert(data.msg);
      if (res.ok) setViewState("admin-login");
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#F0F4F8] overflow-hidden font-sans text-slate-800">
      {/* ================= BACKGROUND DOODLE ================= */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full transition-opacity duration-500 ${
          viewState.includes("admin") ? "blur-md" : ""
        }`}
      >
        <div className="w-full h-full flex items-center justify-center opacity-10">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full fill-indigo-500"
          >
            <path
              d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.6,32.6C61,43.7,51.1,53.1,39.8,60.6C28.5,68.1,15.8,73.8,1.6,71C-12.6,68.2,-28.3,56.9,-41.8,45.8C-55.3,34.7,-66.6,23.8,-73.4,10.2C-80.2,-3.4,-82.5,-19.7,-75.9,-33.4C-69.3,-47.1,-53.8,-58.2,-38.7,-64.8C-23.6,-71.4,-8.9,-73.5,4.7,-81.6L9.4,-89.7"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      {/* ================= MAIN LANDING ELEMENTS (Image 1) ================= */}
      <div
        onDoubleClick={() => setViewState("admin-hub")}
        className="absolute top-0 right-0 bg-white shadow-lg p-4 px-8 rounded-bl-3xl cursor-pointer hover:bg-indigo-50 transition-colors z-20 flex items-center gap-3 border-b border-l border-indigo-100"
      >
        <span className="font-bold text-lg text-indigo-900">
          Student Portal
        </span>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <IconGraduationCap />
        </div>
      </div>

      <button
        onClick={() => setViewState("login-slide")}
        className="absolute top-20 right-0 bg-white shadow-md pl-6 pr-4 py-3 rounded-l-full hover:bg-indigo-600 hover:text-white transition-all z-20 flex items-center gap-2 group"
      >
        <span className="font-semibold">Login</span>
        <IconLogIn />
      </button>

      <button
        onClick={() => setViewState("signup-slide")}
        className="absolute top-36 right-0 bg-white shadow-md pl-6 pr-4 py-3 rounded-l-full hover:bg-green-600 hover:text-white transition-all z-20 flex items-center gap-2"
      >
        <span className="font-semibold">Signup</span>
        <IconUserPlus />
      </button>

      {/* Greeting Card */}
      <div
        className={`absolute top-1/2 left-[10%] -translate-y-1/2 transition-all duration-500 ${
          viewState !== "default" ? "opacity-50 blur-sm" : "opacity-100"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white max-w-lg">
          <h1 className="text-5xl font-extrabold text-slate-800 leading-tight mb-2">
            Hi Buddy!
          </h1>
          <p className="text-2xl text-slate-600 mb-8">
            Welcome to VPMP Student Portal
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setViewState("signup-slide")}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Get Started
            </button>
            <a
              href="https://vpmp.ac.in"
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-50 transition-all text-center"
            >
              VPMP
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-8 py-3 rounded-full shadow-md text-sm font-medium text-slate-500 border border-slate-200">
        © 2025 VPMP Polytechnic • All Rights Reserved
      </div>

      {/* ================= LOGIN SLIDE-IN ================= */}
      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-30 transition-transform duration-500 ease-out flex flex-col justify-center p-12 ${
          viewState === "login-slide" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setViewState("default")}
          className="absolute top-8 left-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <IconX />
        </button>
        <h2 className="text-4xl font-bold text-indigo-900 mb-2">
          Welcome Back!
        </h2>
        <form onSubmit={handleStudentLogin} className="space-y-6 mt-8">
          <input
            className="pill-input"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
          />
          <input
            className="pill-input"
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* ================= SIGNUP SLIDE-UP ================= */}
      <div
        className={`absolute bottom-0 right-0 md:right-10 w-full md:w-[450px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl z-30 transition-transform duration-500 ease-out p-8 ${
          viewState === "signup-slide" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Create Profile</h2>
          <button
            onClick={() => setViewState("default")}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <IconX />
          </button>
        </div>
        <form
          onSubmit={handleStudentSignup}
          className="space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <input
            className="pill-input"
            placeholder="Full Name"
            onChange={(e) =>
              setSignupForm({ ...signupForm, fullName: e.target.value })
            }
          />
          <input
            className="pill-input"
            placeholder="Enrollment No"
            onChange={(e) =>
              setSignupForm({ ...signupForm, enrollmentNo: e.target.value })
            }
          />
          <input
            className="pill-input"
            placeholder="Username"
            onChange={(e) =>
              setSignupForm({ ...signupForm, username: e.target.value })
            }
          />
          <input
            className="pill-input"
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setSignupForm({ ...signupForm, email: e.target.value })
            }
          />
          <input
            className="pill-input"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setSignupForm({ ...signupForm, password: e.target.value })
            }
          />
          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-full font-bold shadow hover:bg-green-700 transition-all mt-4"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* ================= ADMIN MODAL OVERLAY ================= */}
      {viewState.includes("admin") && (
        <div className="absolute inset-0 z-50 bg-white/30 backdrop-blur-xl flex items-center justify-center">
          {viewState === "admin-hub" && (
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full animate-fade-in border border-slate-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                Welcome Master!
              </h2>
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setViewState("admin-login")}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <IconShield /> Login to Dashboard
                </button>
                <button
                  onClick={() => setViewState("admin-signup")}
                  className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Want to be an Admin
                </button>
              </div>
              <button
                onClick={() => setViewState("default")}
                className="text-red-500 font-semibold hover:underline"
              >
                Cancel
              </button>
            </div>
          )}

          {viewState === "admin-login" && (
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm relative animate-fade-in">
              <button
                onClick={() => setViewState("admin-hub")}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
              >
                <IconX />
              </button>
              <h3 className="text-2xl font-bold text-center mb-6">
                Admin Login
              </h3>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  className="pill-input bg-slate-50"
                  placeholder="Username"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, username: e.target.value })
                  }
                />
                <input
                  className="pill-input bg-slate-50"
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                />
                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700"
                >
                  Login
                </button>
              </form>
            </div>
          )}

          {/* FIX: ADDED BRANCH SELECTION */}
          {viewState === "admin-signup" && (
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm relative animate-fade-in">
              <button
                onClick={() => setViewState("admin-hub")}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
              >
                <IconX />
              </button>
              <h3 className="text-2xl font-bold text-center mb-6">
                Join Admin Team
              </h3>
              <form onSubmit={handleAdminSignup} className="space-y-3">
                <input
                  className="pill-input bg-slate-50"
                  placeholder="Username"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, username: e.target.value })
                  }
                />
                <input
                  className="pill-input bg-slate-50"
                  type="email"
                  placeholder="Email"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, email: e.target.value })
                  }
                />

                {/* Branch Dropdown */}
                <select
                  className="pill-input bg-slate-50 text-slate-600"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, branch: e.target.value })
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Branch
                  </option>
                  <option value="Computer">Computer</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="IT">IT</option>
                  <option value="Admin">General Admin</option>
                </select>

                <input
                  className="pill-input bg-slate-50"
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                />
                <button
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-3 rounded-full font-bold hover:bg-slate-800 mt-2"
                >
                  Signup
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <style>{`
        .pill-input { width: 100%; padding: 12px 20px; border-radius: 9999px; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; }
        .pill-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
      `}</style>
    </div>
  );
}
