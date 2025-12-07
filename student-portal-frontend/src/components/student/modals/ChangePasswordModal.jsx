import { useState } from "react";
import { Lock, X } from "lucide-react";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword)
      return alert("New passwords do not match!");

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Password Changed Successfully!");
        onClose();
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(data.msg || "Failed to update password");
      }
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Current Password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
