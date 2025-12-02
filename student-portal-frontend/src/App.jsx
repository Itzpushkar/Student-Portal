import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSignupPage from "./pages/AdminSignupPage";
// Auth Context & Protection
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* --- Public Student Routes --- */}
          {/* Note: Student Login/Signup is now handled inside LandingPage */}
          <Route path="/" element={<LandingPage />} />

          {/* --- Hidden Admin Routes --- */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-signup" element={<AdminSignupPage />} />

          {/* --- Protected Student Route --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* --- Protected Admin Route --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
