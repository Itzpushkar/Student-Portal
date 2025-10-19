import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import AcademicDetailsForm from "../components/AcademicDetailsForm";
import SemesterSelector from "../components/SemesterSelector";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("welcome");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/user/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUserData(data);
        
        // Determine current step based on user data
        if (!data.personalDetails?.isCompleted) {
          setCurrentStep("personal");
        } else if (!data.isAcademicDetailsCompleted) {
          setCurrentStep("academic");
        } else {
          setCurrentStep("welcome");
        }
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalDetailsComplete = () => {
    setCurrentStep("academic");
    fetchUserData(); // Refresh data
  };

  const handleAcademicDetailsComplete = () => {
    setCurrentStep("welcome");
    fetchUserData(); // Refresh data
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🎓 Student Portal Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/90 font-medium">
                Welcome, {userData?.personalDetails?.fullName || user.username}!
              </span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "welcome" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to Your Dashboard!</h2>
              <p className="text-white/80 text-lg">Manage your academic journey with ease</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="status-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    ✅
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Personal Details</h3>
                    <p className="text-gray-600">Your personal information is complete</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep("personal")} 
                  className="btn-outline w-full"
                >
                  Update Details
                </button>
              </div>
              
              <div className="status-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    ✅
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Academic Details</h3>
                    <p className="text-gray-600">Your academic information is complete</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep("academic")} 
                  className="btn-outline w-full"
                >
                  Update Academic Details
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Semester Progression</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Current Semester: <strong className="text-primary-600">{userData?.currentSemester || 1}</strong></p>
                </div>
                <button 
                  onClick={() => setCurrentStep("semester-selector")} 
                  className="btn-primary"
                >
                  Select New Semester
                </button>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setCurrentStep("academic")} 
                className="btn-primary text-lg px-8 py-4"
              >
                Add New Semester Details
              </button>
            </div>
          </div>
        )}

        {currentStep === "personal" && (
          <PersonalDetailsForm
            userData={{ ...userData, _id: user._id }}
            onComplete={handlePersonalDetailsComplete}
            onCancel={() => setCurrentStep("welcome")}
          />
        )}

        {currentStep === "academic" && (
          <AcademicDetailsForm
            userData={{ ...userData, _id: user._id }}
            onComplete={handleAcademicDetailsComplete}
            onCancel={() => setCurrentStep("welcome")}
          />
        )}

        {currentStep === "semester-selector" && (
          <SemesterSelector
            userData={{ ...userData, _id: user._id }}
            onComplete={() => {
              setCurrentStep("welcome");
              fetchUserData();
            }}
            onCancel={() => setCurrentStep("welcome")}
          />
        )}
      </main>
    </div>
  );
}
