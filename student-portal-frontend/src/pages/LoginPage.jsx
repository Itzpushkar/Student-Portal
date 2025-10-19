// import { useState } from "react";
// import { login } from "../api/auth";
// import AuthProvider from "../context/AuthProvider";
// import { useAuth } from "../context/useAuth";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const { loginUser } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await login(form);
//       loginUser(res.data.user);
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           name="username"
//           placeholder="Username or Email"
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const res = await login(form);
      loginUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Login failed");
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your academic journey</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username or Email *</label>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter your username or email"
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
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
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account? 
                <span 
                  onClick={() => navigate("/signup")} 
                  className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer ml-1"
                >
                  Create Account
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
