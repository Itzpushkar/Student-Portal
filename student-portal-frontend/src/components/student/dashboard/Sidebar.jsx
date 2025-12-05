import { LayoutDashboard, User, BookOpen, LogOut } from "lucide-react";

export default function Sidebar({ currentView, setCurrentView, onLogout }) {
  return (
    <aside className="w-20 lg:w-72 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
      <div className="p-6 flex items-center gap-3 text-white mb-6">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
          P
        </div>
        <span className="font-bold text-xl hidden lg:block tracking-tight">
          StudentPortal
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          active={currentView === "dashboard"}
          onClick={() => setCurrentView("dashboard")}
        />
        <SidebarItem
          icon={<User size={20} />}
          label="My Profile"
          active={currentView === "profile"}
          onClick={() => setCurrentView("profile")}
        />
        <SidebarItem
          icon={<BookOpen size={20} />}
          label="Academics"
          active={currentView === "academic"}
          onClick={() => setCurrentView("academic")}
        />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut size={20} className="group-hover:text-red-400" />
          <span className="hidden lg:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all group ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          : "hover:bg-slate-800 hover:text-white"
      }`}
    >
      <div
        className={
          active ? "text-white" : "text-slate-400 group-hover:text-white"
        }
      >
        {icon}
      </div>
      <span className="hidden lg:block font-medium">{label}</span>
    </button>
  );
}
