// // import { useState } from "react";
// // import { signup, verifyOtp } from "../api/auth";
// // import OTPModal from "../components/OTPModal";
// // import AuthProvider from "../context/AuthProvider";
// // import { useAuth } from "../context/useAuth";
// // import { useNavigate } from "react-router-dom";

// // export default function SignupPage() {
// //   const [form, setForm] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //     fullName: "",
// //     enrollmentNo: "",
// //   });
// //   const [showOtpModal, setShowOtpModal] = useState(false);
// //   const [userId, setUserId] = useState(null);
// //   const navigate = useNavigate();
// //   const { loginUser } = useAuth();

// //   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSignup = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await signup(form);
// //       setUserId(res.data.user._id);
// //       setShowOtpModal(true);
// //     } catch (err) {
// //       alert(err.response?.data?.msg || "Signup failed");
// //     }
// //   };

// //   const handleOtpVerify = async (otp) => {
// //     try {
// //       const res = await verifyOtp({ userId, otp });
// //       loginUser(res.data.user);
// //       setShowOtpModal(false);
// //       navigate("/dashboard");
// //     } catch (err) {
// //       alert(err.response?.data?.msg || "Invalid OTP");
// //     }
// //   };

// //   return (
// //     <div className="signup-container">
// //       <h2>Create Account</h2>
// //       <form onSubmit={handleSignup}>
// //         <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
// //         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
// //         <input name="username" placeholder="Username" onChange={handleChange} required />
// //         <input name="enrollmentNo" placeholder="Enrollment No. or Temp Roll No." onChange={handleChange} required />
// //         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
// //         <button type="submit">Sign Up & Get OTP</button>
// //       </form>

// //       {showOtpModal && (
// //         <OTPModal onClose={() => setShowOtpModal(false)} onVerify={handleOtpVerify} />
// //       )}
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { signup, verifyOtp } from "../api/auth";
// import OTPModal from "../components/OTPModal";
// import { useAuth } from "../context/useAuth";
// import { useNavigate } from "react-router-dom";

// export default function SignupPage() {
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     fullName: "",
//     enrollmentNo: "",
//   });
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [userEmail, setUserEmail] = useState(""); // store email for OTP verification
//   const navigate = useNavigate();
//   const { loginUser } = useAuth();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await signup(form);
//       setUserEmail(res.data.user.email); // save email for OTP
//       setShowOtpModal(true);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Signup failed");
//     }
//   };

//   const handleOtpVerify = async (otp) => {
//     try {
//       const res = await verifyOtp({ email: userEmail, otp }); // send email + otp
//       loginUser(res.data.user); // log in user after OTP
//       setShowOtpModal(false);
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Invalid OTP");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSignup}>
//         <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//         <input name="username" placeholder="Username" onChange={handleChange} required />
//         <input name="enrollmentNo" placeholder="Enrollment No. or Temp Roll No." onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">Sign Up & Get OTP</button>
//       </form>

//       {showOtpModal && (
//         <OTPModal onClose={() => setShowOtpModal(false)} onVerify={handleOtpVerify} />
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { signup, verifyOtp } from "../api/auth";
import OTPModal from "../components/OTPModal";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    enrollmentNo: "",
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const res = await signup(form);
      setUserEmail(res.data.user.email);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      const res = await verifyOtp({ email: userEmail, otp });
      loginUser(res.data.user);
      setShowOtpModal(false);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join thousands of students managing their academic journey</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name *</label>
                <input 
                  id="fullName"
                  name="fullName" 
                  placeholder="Enter your full name" 
                  onChange={handleChange} 
                  required 
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input 
                  id="email"
                  name="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  onChange={handleChange} 
                  required 
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username *</label>
                  <input 
                    id="username"
                    name="username" 
                    placeholder="Choose a username" 
                    onChange={handleChange} 
                    required 
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="enrollmentNo" className="form-label">Enrollment No. *</label>
                  <input 
                    id="enrollmentNo"
                    name="enrollmentNo" 
                    placeholder="Enrollment or Roll No." 
                    onChange={handleChange} 
                    required 
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password *</label>
                <input 
                  id="password"
                  name="password" 
                  type="password" 
                  placeholder="Create a strong password" 
                  onChange={handleChange} 
                  required 
                  className="input-field"
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full py-4 text-lg" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account & Get OTP"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account? 
                <span 
                  onClick={() => navigate("/login")} 
                  className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer ml-1"
                >
                  Sign In
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <OTPModal onClose={() => setShowOtpModal(false)} onVerify={handleOtpVerify} />
      )}
    </div>
  );
}
