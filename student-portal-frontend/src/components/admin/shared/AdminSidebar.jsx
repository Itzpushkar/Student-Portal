import { useNavigate } from "react-router-dom";
import { Icons } from "./SharedComponents"; // Ensure this path is correct based on structure

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  tabs,
}) {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-[#1E1E2D] text-white flex flex-col flex-shrink-0 shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-white/10 mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
          S
        </div>
        <div>
          <h1 className="font-bold">Super Admin</h1>
          <p className="text-xs text-slate-400">Full Access</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // BUG FIX: Do NOT reset branch/semester here.
              // This allows filters to persist when switching tabs.
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-white/5"
            }`}
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
        >
          <Icons.Logout /> Logout
        </button>
      </div>
    </aside>
  );
}
