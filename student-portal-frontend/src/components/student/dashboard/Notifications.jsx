import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
      <div className="p-4 bg-slate-50 rounded-full mb-4">
        <Bell size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-600">No New Notifications</h3>
      <p className="text-sm">We'll notify you when important updates arrive.</p>
    </div>
  );
}
