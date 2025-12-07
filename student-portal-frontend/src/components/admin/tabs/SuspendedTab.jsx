export default function SuspendedTab({ data, onUnsuspend, onSuspend }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => {
        const isSuspended = item.accountStatus?.status === "Suspended";
        return (
          <div
            key={item._id}
            className={`group bg-white rounded-[20px] p-6 border transition-all duration-300 ${
              isSuspended
                ? "border-orange-100 shadow-[0_4px_20px_rgba(249,115,22,0.05)]"
                : "border-slate-100 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-lg overflow-hidden ${
                  isSuspended
                    ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-200"
                    : "bg-gradient-to-br from-slate-400 to-slate-500"
                }`}
              >
                {item.personalDetails?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000/${item.personalDetails.profilePhoto}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  item.username?.[0].toUpperCase()
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">
                  {item.username}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {item.enrollmentNo}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <span className="text-sm font-bold text-slate-400">Action:</span>
              <button
                onClick={() =>
                  isSuspended ? onUnsuspend(item._id) : onSuspend(item)
                }
                className={`w-28 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  isSuspended
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                }`}
              >
                {isSuspended ? "Yes (Undo)" : "No (Suspend)"}
              </button>
            </div>

            {isSuspended && (
              <div className="mt-4 p-3 bg-orange-50/50 rounded-xl text-xs text-orange-800 border border-orange-100/50">
                <strong>Reason:</strong> {item.accountStatus?.suspendReason}
                <br />
                <strong>Until:</strong>{" "}
                {item.accountStatus?.suspendedUntil
                  ? new Date(item.accountStatus.suspendedUntil).toDateString()
                  : "Indefinite"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
