import { Radio } from "lucide-react";

export default function Broadcasts() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
      <div className="p-4 bg-slate-50 rounded-full mb-4">
        <Radio size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-600">Broadcast Channel</h3>
      <p className="text-sm">
        Official announcements from Admin will appear here.
      </p>
    </div>
  );
}
