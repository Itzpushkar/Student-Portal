import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";

import LandingPage from "./pages/public/LandingPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import AdminSignupPage from "./pages/auth/AdminSignupPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import SubAdminDashboard from "./pages/admin/SubAdminDashboard"; // NEW

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-signup" element={<AdminSignupPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Route */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Sub Admin Route */}
          <Route
            path="/sub-admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <SubAdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
