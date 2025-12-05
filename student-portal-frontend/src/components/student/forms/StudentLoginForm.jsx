import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

export default function StudentLoginForm({ onClose }) {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = { msg: await res.text() };
      }

      if (res.ok) {
        loginUser(data.user);
        navigate("/dashboard");
      } else {
        alert(data.msg || `Login Failed`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Network Error: Unable to reach server.");
    } finally {
      setLoading(false);
    }
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
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <h2 className="text-4xl font-bold text-indigo-900 mb-2">Welcome Back!</h2>
      <p className="text-slate-500 mb-8">
        Login to access your student dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
      </form>
    </div>
  );
}
