import { useState } from "react";

export default function StudentSignupForm({ onClose, onSwitchToLogin }) {
  // Steps: 1 = Details Form, 2 = OTP Verification
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    enrollmentNo: "",
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  // --- HANDLER: SIGNUP (STEP 1) ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = { msg: (await res.text()) || "Server Error" };
      }

      if (res.ok) {
        // Success: Move to OTP step
        setStep(2);
      } else {
        alert(data.msg || "Signup Failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Network Error: Unable to reach server.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: VERIFY OTP (STEP 2) ---
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account Created Successfully! Please Login.");
        onSwitchToLogin(); // Redirect to login panel
      } else {
        alert(data.msg || "Invalid OTP");
      }
    } catch (err) {
      alert("Verification Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-8">
        <h2 className="text-2xl font-bold text-slate-800">
          {step === 1 ? "Create Profile" : "Verify Email"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full"
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
      </div>

      {/* STEP 1: REGISTRATION FORM */}
      {step === 1 && (
        <form
          onSubmit={handleSignup}
          className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar flex-1"
        >
          <input
            className="pill-input"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            className="pill-input"
            placeholder="Enrollment No"
            onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
            required
          />
          <input
            className="pill-input"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className="pill-input"
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="pill-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-full font-bold shadow hover:bg-green-700 transition-all mt-4"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP FORM */}
      {step === 2 && (
        <div className="space-y-6">
          <p className="text-slate-500 text-sm">
            We have sent a verification code to{" "}
            <span className="font-bold text-slate-800">{form.email}</span>
          </p>

          <input
            className="pill-input text-center text-2xl tracking-widest font-bold text-slate-800"
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-bold shadow hover:bg-blue-700 transition-all"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={() => setStep(1)}
            className="w-full text-slate-400 text-sm hover:text-slate-600"
          >
            Back to Signup
          </button>
        </div>
      )}
    </div>
  );
}
