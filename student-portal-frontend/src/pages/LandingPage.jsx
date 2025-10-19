import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full text-center">
          {/* Header */}
          <div className="mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-black gradient-text mb-6 drop-shadow-2xl">
              🎓 Student Portal
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Your Gateway to Academic Excellence
            </p>
          </div>

          {/* Auth Container */}
          <div className="card max-w-2xl mx-auto p-8 mb-16 animate-slide-up">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button 
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'signup' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Create Account
              </button>
              <button 
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'login' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {activeTab === 'signup' ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Join Our Student Portal</h2>
                    <p className="text-gray-600 text-lg">Create your account to access all academic features</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        📝
                      </div>
                      <h3 className="font-semibold text-gray-800">Personal Details</h3>
                      <p className="text-sm text-gray-600">Manage your information</p>
                    </div>
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        📊
                      </div>
                      <h3 className="font-semibold text-gray-800">Progress Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor your academic journey</p>
                    </div>
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        📄
                      </div>
                      <h3 className="font-semibold text-gray-800">PDF Reports</h3>
                      <p className="text-sm text-gray-600">Generate detailed reports</p>
                    </div>
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        📧
                      </div>
                      <h3 className="font-semibold text-gray-800">Email Alerts</h3>
                      <p className="text-sm text-gray-600">Stay updated with notifications</p>
                    </div>
                  </div>
                  
                  <button 
                    className="btn-primary w-full text-lg py-4"
                    onClick={() => navigate('/signup')}
                  >
                    Get Started Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back!</h2>
                    <p className="text-gray-600 text-lg">Sign in to continue your academic journey</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        ✅
                      </div>
                      <h3 className="font-semibold text-gray-800">Dashboard Access</h3>
                      <p className="text-sm text-gray-600">View your complete profile</p>
                    </div>
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        📈
                      </div>
                      <h3 className="font-semibold text-gray-800">Progress Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor your achievements</p>
                    </div>
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        🔄
                      </div>
                      <h3 className="font-semibold text-gray-800">Update Details</h3>
                      <p className="text-sm text-gray-600">Keep your info current</p>
                    </div>
                    <div className="feature-card">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl mb-3">
                        📱
                      </div>
                      <h3 className="font-semibold text-gray-800">Mobile Ready</h3>
                      <p className="text-sm text-gray-600">Access from anywhere</p>
                    </div>
                  </div>
                  
                  <button 
                    className="btn-primary w-full text-lg py-4"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Features</h4>
                <ul className="space-y-2 text-white/80">
                  <li>Personal Details Management</li>
                  <li>Academic Progress Tracking</li>
                  <li>Semester-wise Data Entry</li>
                  <li>PDF Report Generation</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Support</h4>
                <ul className="space-y-2 text-white/80">
                  <li>Help Center</li>
                  <li>Contact Support</li>
                  <li>User Guide</li>
                  <li>FAQ</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-4">About</h4>
                <ul className="space-y-2 text-white/80">
                  <li>Our Mission</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Version 1.0</li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-white/70">&copy; 2024 Student Portal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
