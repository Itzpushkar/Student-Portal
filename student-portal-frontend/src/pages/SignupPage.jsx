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
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await signup(form);
      setUserEmail(res.data.user.email);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      const res = await verifyOtp({ email: userEmail, otp });
      loginUser(res.data.user);
      setShowOtpModal(false);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="enrollmentNo" placeholder="Enrollment No. or Temp Roll No." onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up & Get OTP</button>
      </form>

      {showOtpModal && (
        <OTPModal onClose={() => setShowOtpModal(false)} onVerify={handleOtpVerify} />
      )}
    </div>
  );
}
