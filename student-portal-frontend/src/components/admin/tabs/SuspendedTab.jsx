export default function SuspendedTab({ data, onUnsuspend }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
              {item.username?.[0]}
            </div>
            <div>
              <h4 className="font-bold text-slate-800">
                {item.personalDetails?.fullName || item.username}
              </h4>
              <p className="text-xs text-slate-500">{item.enrollmentNo}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-600">
              SUSPENDED
            </span>
            <button
              onClick={() => onUnsuspend(item._id)}
              className="text-xs font-bold text-green-600 hover:underline"
            >
              Unsuspend
            </button>
          </div>
          <div className="mt-3 p-3 bg-orange-50 rounded-xl text-xs text-orange-800 border border-orange-100">
            <strong>Reason:</strong>{" "}
            {item.accountStatus?.suspendReason || "Admin Action"}
            <br />
            <strong>Until:</strong>{" "}
            {item.accountStatus?.suspendedUntil
              ? new Date(item.accountStatus.suspendedUntil).toDateString()
              : "Indefinite"}
          </div>
        </div>
      ))}
    </div>
  );
}
