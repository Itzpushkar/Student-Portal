import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

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

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [superAdminExists, setSuperAdminExists] = useState(false); // New State

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "super-admin", // Default, will change if superAdminExists
    branch: "",
    post: "",
  });

  // Check Super Admin Status on Load
  useEffect(() => {
    const checkSuper = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/check-super-admin"
        );
        const data = await res.json();
        setSuperAdminExists(data.exists);

        if (data.exists) {
          // If Super Admin exists, force Sub-Admin role logic
          setForm((prev) => ({ ...prev, role: "sub-admin" }));
        }
      } catch (e) {
        console.error("Error checking super admin", e);
      }
    };
    checkSuper();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleChange = (roleValue) => setForm({ ...form, role: roleValue });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMessage({ text: data.msg, type: "success" });
      } else {
        setMessage({ text: data.msg, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: otpValue }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.requireApproval) {
          setStep(3); // Wait for approval UI
        } else {
          // Auto-approved (Only for first Super Admin)
          loginUser({ ...data.user, role: "super-admin" });
          navigate("/super-admin");
        }
      } else {
        setMessage({ text: data.msg, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Verification failed", type: "error" });
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

        {step !== 3 && (
          <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-8">
            {step === 1 ? "Admin Registration" : "Verify Email"}
          </h2>
        )}

        {message.text && step !== 3 && (
          <div
            className={`p-3 rounded-xl mb-6 text-sm text-center ${
              message.type === "error"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSignup} className="space-y-5">
            <input
              name="username"
              placeholder="Username"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onChange={handleChange}
              required
            />

            {/* HIDE RADIO IF SUPER ADMIN EXISTS */}
            {!superAdminExists && (
              <div className="flex items-center justify-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="super-admin"
                    checked={form.role === "super-admin"}
                    onChange={() => handleRoleChange("super-admin")}
                    className="accent-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    General (Super)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="sub-admin"
                    checked={form.role === "sub-admin"}
                    onChange={() => handleRoleChange("sub-admin")}
                    className="accent-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Branch (Sub)
                  </span>
                </label>
              </div>
            )}

            {/* SHOW IF SUB-ADMIN (Either forced or selected) */}
            {form.role === "sub-admin" && (
              <div className="space-y-4 animate-slideDown">
                <select
                  name="branch"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none cursor-pointer"
                  onChange={handleChange}
                  required
                  value={form.branch}
                >
                  <option value="" disabled>
                    Select Branch
                  </option>
                  <option value="Computer">Computer Engineering</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="EC">EC Engineering</option>
                </select>
                <select
                  name="post"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none cursor-pointer"
                  onChange={handleChange}
                  required
                  value={form.post}
                >
                  <option value="" disabled>
                    Select Post
                  </option>
                  <option value="HOD">HOD</option>
                  <option value="Proctor/Mentor">Proctor/Mentor</option>
                  <option value="Class Counsellor">Class Counsellor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-70 mt-4"
            >
              {loading ? "Creating Account..." : "Signup"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center animate-fadeIn">
            <p className="text-slate-500 mb-6">
              Enter code sent to <span className="font-bold">{form.email}</span>
            </p>
            <input
              id="otpInput"
              type="text"
              maxLength={6}
              placeholder="0 0 0 0 0 0"
              className="w-full px-5 py-4 text-center text-2xl tracking-[0.5em] font-bold rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 mb-6"
            />
            <button
              onClick={() =>
                handleVerifyOTP(document.getElementById("otpInput").value)
              }
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify & Proceed"}
            </button>
            <button
              onClick={() => setStep(1)}
              className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium"
            >
              Change Email / Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center animate-fadeIn py-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Request Sent
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Your Admin Request is pending approval. You will be notified via
              email.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
      <style>{`.animate-slideDown { animation: slideDown 0.3s ease-out forwards; } @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
