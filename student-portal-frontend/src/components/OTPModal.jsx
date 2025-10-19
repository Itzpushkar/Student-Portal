// import { useState } from "react";

// export default function OTPModal({ onClose, onVerify }) {
//   const [otp, setOtp] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onVerify(otp);
//   };

//   return (
//     <div className="otp-modal">
//       <div className="otp-box">
//         <h3>Enter OTP</h3>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Enter 6-digit OTP"
//             required
//           />
//           <button type="submit">Verify</button>
//         </form>
//         <button onClick={onClose}>Cancel</button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";

export default function OTPModal({ onClose, onVerify }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <div className="otp-modal">
      <div className="otp-box">
        <h3>Enter OTP</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
        <button onClick={onClose} style={{ marginTop: "10px", background: "#ef4444" }}>Cancel</button>
      </div>
    </div>
  );
}
