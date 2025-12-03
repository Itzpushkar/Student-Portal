import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    branch: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        setMessage({ text: data.msg, type: "success" });
        // If auto-approved (Super Admin), redirect to login quickly
        // If pending (Sub Admin), give them time to read the message
        setTimeout(() => navigate("/admin-login"), 3000);
      } else {
        setMessage({ text: data.msg || "Request failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-600/20 rounded-full blur-[100px]"></div>

      <div className="card w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-600 p-8 rounded-2xl shadow-2xl z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Request Admin Access
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Submit your credentials. The first registered admin becomes the Super
          Admin.
        </p>

        {message.text && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm border ${
              message.type === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-200"
                : "bg-red-500/20 border-red-500/50 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {!message.text?.includes("success") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="input-field w-full bg-slate-900 border-slate-700 text-white p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              className="input-field w-full bg-slate-900 border-slate-700 text-white p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            {/* BRANCH SELECTION DROPDOWN */}
            <select
              className="input-field w-full bg-slate-900 border-slate-700 text-slate-300 p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select Department / Branch
              </option>
              <option value="Computer">Computer Engineering</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="Admin">General Administration</option>
            </select>

            <input
              className="input-field w-full bg-slate-900 border-slate-700 text-white p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-slate-500 hover:text-white text-xs w-full text-center"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
}
