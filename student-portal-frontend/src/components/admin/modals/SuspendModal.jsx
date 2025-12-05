export default function SuspendModal({
  isOpen,
  onClose,
  onConfirm,
  form,
  setForm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Suspend Student
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          This will restrict the student's access.
        </p>

        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
          Duration
        </label>
        <select
          className="w-full filter-select mb-4"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        >
          {[
            "1 Day",
            "2 Days",
            "5 Days",
            "1 Week",
            "2 Weeks",
            "1 Month",
            "3 Months",
            "Until I unsuspend",
          ].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
          Reason
        </label>
        <input
          className="w-full filter-select mb-6"
          placeholder="Reason for suspension..."
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-slate-500 font-bold bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
