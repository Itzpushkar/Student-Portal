import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLoginForm from "../../components/student/forms/StudentLoginForm";
import StudentSignupForm from "../../components/student/forms/StudentSignupForm";

// Icons
const IconGraduationCap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 0 6 0 9 5 0-5 3-5 9-5v-5" />
  </svg>
);
const IconLogIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);
const IconUserPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" x2="20" y1="8" y2="14" />
    <line x1="23" x2="17" y1="11" y2="11" />
  </svg>
);
const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState("default");

  const closePanels = () => setViewState("default");
  const isModalOpen = viewState !== "default";

  return (
    <div className="relative w-full h-screen bg-[#F0F4F8] overflow-hidden font-sans text-slate-800">
      <div
        className={`transition-all duration-300 h-full ${
          isModalOpen
            ? "opacity-50 blur-sm pointer-events-none select-none"
            : "opacity-100"
        }`}
      >
        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center opacity-10">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full fill-indigo-500"
          >
            <path
              d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.6,32.6C61,43.7,51.1,53.1,39.8,60.6C28.5,68.1,15.8,73.8,1.6,71C-12.6,68.2,-28.3,56.9,-41.8,45.8C-55.3,34.7,-66.6,23.8,-73.4,10.2C-80.2,-3.4,-82.5,-19.7,-75.9,-33.4C-69.3,-47.1,-53.8,-58.2,-38.7,-64.8C-23.6,-71.4,-8.9,-73.5,4.7,-81.6L9.4,-89.7"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div
          onDoubleClick={() => setViewState("admin-hub")}
          className="absolute top-0 right-0 bg-white shadow-lg p-4 px-8 rounded-bl-3xl cursor-pointer hover:bg-indigo-50 transition-colors z-20 flex items-center gap-3 border-b border-l border-indigo-100"
        >
          <span className="font-bold text-lg text-indigo-900">
            Student Portal
          </span>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <IconGraduationCap />
          </div>
        </div>

        <button
          onClick={() => setViewState("login-slide")}
          className="absolute top-20 right-0 bg-white shadow-md pl-6 pr-4 py-3 rounded-l-full hover:bg-indigo-600 hover:text-white transition-all z-20 flex items-center gap-2 group"
        >
          <span className="font-semibold">Login</span>
          <IconLogIn />
        </button>

        <button
          onClick={() => setViewState("signup-slide")}
          className="absolute top-36 right-0 bg-white shadow-md pl-6 pr-4 py-3 rounded-l-full hover:bg-green-600 hover:text-white transition-all z-20 flex items-center gap-2"
        >
          <span className="font-semibold">Signup</span>
          <IconUserPlus />
        </button>

        <div className="absolute top-1/2 left-[10%] -translate-y-1/2">
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white max-w-lg">
            <h1 className="text-5xl font-extrabold text-slate-800 leading-tight mb-2">
              Hi Buddy!
            </h1>
            <p className="text-2xl text-slate-600 mb-8">
              Welcome to VPMP Student Portal
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setViewState("signup-slide")}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700"
              >
                Get Started
              </button>
              <a
                href="https://vpmp.ac.in"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-50 transition-all text-center"
              >
                VPMP
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-8 py-3 rounded-full shadow-md text-sm font-medium text-slate-500 border border-slate-200">
          © 2025 VPMP Polytechnic • All Rights Reserved
        </div>
      </div>

      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-30 transition-transform duration-500 ease-out p-12 ${
          viewState === "login-slide" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <StudentLoginForm
          onClose={closePanels}
          onSwitchToSignup={() => setViewState("signup-slide")}
        />
      </div>

      <div
        className={`absolute bottom-0 right-0 md:right-10 w-full md:w-[450px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl z-30 transition-transform duration-500 ease-out p-8 ${
          viewState === "signup-slide" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <StudentSignupForm
          onClose={closePanels}
          onSwitchToLogin={() => setViewState("login-slide")}
        />
      </div>

      {viewState === "admin-hub" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <div className="bg-white p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full animate-fade-in border border-slate-100 relative">
            <button
              onClick={closePanels}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <IconX />
            </button>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Welcome Master!
            </h2>
            <p className="text-slate-500 mb-8 text-sm">
              Select an action to proceed.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/admin-login")}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <IconShield /> Login to Dashboard
              </button>
              <button
                onClick={() => navigate("/admin-signup")}
                className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-50"
              >
                Want to be an Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.pill-input { width: 100%; padding: 12px 20px; border-radius: 9999px; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; background: #f8fafc; } .pill-input:focus { border-color: #4f46e5; background: white; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }`}</style>
    </div>
  );
}
