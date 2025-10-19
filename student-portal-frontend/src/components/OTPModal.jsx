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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full p-8 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            🔐
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h3>
          <p className="text-gray-600">Please enter the 6-digit code sent to your email</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="input-field text-center text-2xl font-mono tracking-widest"
            />
          </div>
          
          <div className="space-y-3">
            <button 
              type="submit" 
              className="btn-primary w-full py-3"
            >
              Verify OTP
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-outline w-full py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
