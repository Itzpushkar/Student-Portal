import { AlertTriangle, X } from "lucide-react";

export default function WarningModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center relative animate-scale-in border border-slate-100">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Warning Icon */}
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100">
          <AlertTriangle size={32} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">
          {title || "Attention Needed"}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          Okay, Got it
        </button>
      </div>
    </div>
  );
}
