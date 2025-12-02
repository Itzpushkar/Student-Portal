import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth(); // We reuse the auth context to store admin session

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // Important for cookies
      });

      const data = await res.json();

      if (res.ok) {
        // Save admin user data to context just like a student
        // Ensure the data structure matches what your AuthProvider expects
        loginUser({ ...data.admin, role: "admin" });
        navigate("/admin"); // Redirect to Admin Dashboard
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>

      <div className="card w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
        <p className="text-slate-400 mb-6">Restricted Access Only</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="admin_user"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-6 text-slate-500 hover:text-white text-sm w-full text-center transition-colors"
        >
          ← Return to Public Site
        </button>
      </div>
    </div>
  );
}
