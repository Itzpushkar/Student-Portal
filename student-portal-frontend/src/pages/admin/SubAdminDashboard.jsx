import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function SubAdminDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-slate-200">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome, {user?.username}
        </h1>
        <p className="text-indigo-600 font-semibold uppercase tracking-wider text-sm mb-6">
          {user?.branch} Department
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            Work in Progress
          </h2>
          <p className="text-slate-500">
            The Sub-Admin Dashboard is currently under development. You will be
            notified once full access is granted.
          </p>
        </div>

        <button
          onClick={() => {
            logoutUser();
            navigate("/");
          }}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
