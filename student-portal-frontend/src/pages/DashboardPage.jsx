import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import AcademicDetailsForm from "../components/AcademicDetailsForm";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- FIX FOR ISSUE 2: SMART POLLING ---
  // Only poll when the user is on the main 'dashboard' overview.
  // This prevents forms from resetting while the user is typing in 'personal' or 'academic' views.
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Always fetch once on mount or view change to get latest data
    fetchUserData();

    // Only start interval if we are on the main dashboard view
    let intervalId;
    if (currentView === "dashboard") {
      intervalId = setInterval(() => {
        fetchUserData(true);
      }, 10000); // 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, navigate, currentView]); // Re-run effect when view changes

  const fetchUserData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const response = await fetch("http://localhost:5000/api/user/dashboard", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setErrorMsg(null);
      } else if (response.status === 403) {
        const data = await response.json();
        setErrorMsg(data.details || "Access Denied");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const calculateCGPA = () => {
    if (!userData?.academicDetails || userData.academicDetails.length === 0)
      return null;

    let totalGPA = 0;
    let count = 0;
    userData.academicDetails.forEach((sem) => {
      if (sem.gpa) {
        totalGPA += Number(sem.gpa);
        count++;
      }
    });

    return count > 0 ? (totalGPA / count).toFixed(2) : null;
  };

  const cgpa = calculateCGPA();

  if (loading && !userData)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-indigo-600 font-semibold animate-pulse">
        Loading Student Portal...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white p-4 text-center z-50 font-bold shadow-lg">
          ACCOUNT ALERT: {errorMsg}
          <button
            onClick={handleLogout}
            className="ml-4 underline bg-white text-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-white h-screen fixed left-0 top-0 border-r border-slate-200 flex flex-col z-20 transition-all">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            🎓
          </div>
          <span className="hidden lg:block font-bold text-xl tracking-tight">
            Portal
          </span>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
              currentView === "dashboard"
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="hidden lg:block">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView("personal")}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
              currentView === "personal"
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="hidden lg:block">Profile</span>
          </button>
          <button
            onClick={() => setCurrentView("academic")}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
              currentView === "academic"
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl">📚</span>
            <span className="hidden lg:block">Academics</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 lg:ml-64 p-8 transition-all">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {currentView === "dashboard"
                ? "Overview"
                : currentView === "personal"
                ? "My Profile"
                : "Academic Records"}
            </h2>
            <p className="text-slate-500 text-sm">
              {new Date().toDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
              {userData?.personalDetails?.profilePhoto ? (
                <img
                  src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  👤
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD VIEW (With Live Updates) */}
        {currentView === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            <div className="relative w-full h-48 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 shadow-xl overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold">
                  Welcome back,{" "}
                  {userData?.personalDetails?.fullName?.split(" ")[0] ||
                    user.username}
                  !
                </h1>
                <p className="mt-2 opacity-90">
                  Current Semester: {userData?.currentSemester}
                </p>
                {/* Visual Indicator of Pending Status */}
                {userData?.promotionStatus === "pending" && (
                  <div className="inline-flex items-center gap-2 mt-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <span>⏳</span> Promotion Request Pending
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cgpa !== null && (
                <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                  <p className="text-indigo-100 text-sm">Cumulative CGPA</p>
                  <h3 className="text-3xl font-bold">{cgpa}</h3>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm">Backlogs</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {userData?.academicDetails?.reduce(
                    (acc, curr) => acc + (curr.backlogs || 0),
                    0
                  )}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL DETAILS (No Auto-Polling here to prevent reset) */}
        {currentView === "personal" && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-1">
            <PersonalDetailsForm
              userData={{ ...userData, _id: user._id }}
              onComplete={() => {
                setCurrentView("dashboard");
                fetchUserData(); // Refresh data after saving
              }}
              onCancel={() => setCurrentView("dashboard")}
            />
          </div>
        )}

        {/* ACADEMIC DETAILS (No Auto-Polling here to prevent reset) */}
        {currentView === "academic" && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-1">
            <AcademicDetailsForm
              userData={{ ...userData, _id: user._id }}
              onComplete={() => {
                setCurrentView("dashboard");
                fetchUserData(); // Refresh data after saving
              }}
              onCancel={() => setCurrentView("dashboard")}
            />
          </div>
        )}
      </main>
    </div>
  );
}
