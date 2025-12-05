import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

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

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [view, setView] = useState("admin-login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [adminForm, setAdminForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "super-admin",
    action: "dashboard",
    branch: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    enrollmentNo: "",
    password: "",
    branch: "",
  });

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Masquerade Login (Super Admin -> Student)
    if (
      adminForm.role === "super-admin" &&
      adminForm.action === "student-view"
    ) {
      setView("student-impersonation");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminForm.email,
          username: adminForm.username,
          password: adminForm.password,
          role: adminForm.role,
          branch: adminForm.branch,
        }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        loginUser({ ...data.user, role: adminForm.role });

        // REDIRECT LOGIC BASED ON ROLE
        if (adminForm.role === "super-admin") {
          navigate("/super-admin");
        } else {
          navigate("/sub-admin");
        }
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep handleStudentSubmit and JSX from previous version, just ensuring redirect logic is updated)
  // [Rest of the file remains same as previous steps, just ensure the navigate() paths above are updated]

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentNo: studentForm.enrollmentNo,
          password: studentForm.password,
          username: studentForm.name,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        loginUser({ ...data.user, role: "student" });
        navigate("/dashboard");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative p-8">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <IconX />
        </button>
        <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-2">
          {view === "admin-login" ? "Admin Access" : "Student Login"}
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          {view === "admin-login"
            ? "Enter your credentials"
            : "Enter student details"}
        </p>
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {view === "admin-login" && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <input
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Email ID"
              onChange={(e) =>
                setAdminForm({ ...adminForm, email: e.target.value })
              }
              required
            />
            <input
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Username"
              onChange={(e) =>
                setAdminForm({ ...adminForm, username: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Password"
              onChange={(e) =>
                setAdminForm({ ...adminForm, password: e.target.value })
              }
              required
            />

            <div className="relative">
              <select
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                value={adminForm.role}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, role: e.target.value })
                }
              >
                <option value="super-admin">Login as Super Admin</option>
                <option value="sub-admin">Login as Sub Admin</option>
              </select>
            </div>

            {adminForm.role === "super-admin" && (
              <div className="relative animate-slideDown">
                <select
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, action: e.target.value })
                  }
                >
                  <option value="dashboard">
                    Login to Super Admin Dashboard
                  </option>
                  <option value="student-view">
                    Login to Student Dashboard
                  </option>
                </select>
              </div>
            )}

            {adminForm.role === "sub-admin" && (
              <div className="relative animate-slideDown">
                <select
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, branch: e.target.value })
                  }
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="Computer">Computer Engineering</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="EC">EC Engineering</option>
                </select>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-70 mt-4"
            >
              {loading
                ? "Processing..."
                : adminForm.role === "super-admin" &&
                  adminForm.action === "student-view"
                ? "Proceed Further"
                : "Login"}
            </button>
            <div className="text-center mt-4">
              <span className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer">
                Forgot Password?
              </span>
            </div>
          </form>
        )}

        {view === "student-impersonation" && (
          <form
            onSubmit={handleStudentSubmit}
            className="space-y-4 animate-slideDown"
          >
            <input
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none"
              placeholder="Student Name"
              onChange={(e) =>
                setStudentForm({ ...studentForm, name: e.target.value })
              }
              required
            />
            <input
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none"
              placeholder="Enrollment Number"
              onChange={(e) =>
                setStudentForm({ ...studentForm, enrollmentNo: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none"
              placeholder="Password"
              onChange={(e) =>
                setStudentForm({ ...studentForm, password: e.target.value })
              }
              required
            />
            <input
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none"
              placeholder="Branch"
              onChange={(e) =>
                setStudentForm({ ...studentForm, branch: e.target.value })
              }
              required
            />
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setView("admin-login")}
                className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
              >
                Back
              </button>
              <button
                disabled={loading}
                className="w-2/3 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
