import { InfoRow } from "./SharedComponents";

export default function StudentCard({
  std,
  activeTab,
  subTab,
  onReadMore,
  onAction,
  onSuspend,
}) {
  const isRestricted = std.accountStatus?.status !== "Active";

  return (
    <div
      className={`group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${
        isRestricted ? "grayscale opacity-80" : ""
      }`}
    >
      {/* STATUS OVERLAY */}
      {isRestricted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
          <span className="px-4 py-1 bg-red-600 text-white font-black tracking-widest -rotate-6 shadow-lg text-sm rounded">
            {std.accountStatus.status.toUpperCase()}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400 shadow-inner">
            {std.username[0].toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{std.username}</h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
              {std.enrollmentNo}
            </span>
          </div>
        </div>
      </div>

      {/* Info Fields */}
      <div className="space-y-3 mb-6">
        {activeTab === "students" && subTab === "academic" ? (
          <>
            <InfoRow label="Semester" value={std.currentSemester} />
            <InfoRow label="Branch" value={std.personalDetails?.branch} />
            <InfoRow
              label="CGPA"
              value={
                std.academicDetails?.[std.currentSemester - 1]?.gpa || "N/A"
              }
            />
          </>
        ) : (
          <>
            <InfoRow label="Email" value={std.email} truncate />
            <InfoRow
              label="Mobile"
              value={std.personalDetails?.contact || "N/A"}
            />
            <InfoRow
              label="City"
              value={std.personalDetails?.address || "N/A"}
            />
          </>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex gap-2 relative z-20">
        <button
          onClick={() => onReadMore(std)}
          className="flex-1 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-colors"
        >
          Read More
        </button>

        {activeTab === "banned" && (
          <button
            onClick={() => onAction("toggle-ban", { userId: std._id })}
            className="px-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-colors"
          >
            {std.accountStatus?.status === "Banned" ? "Unban" : "Ban"}
          </button>
        )}

        {activeTab === "suspended" && (
          <button
            onClick={() => onSuspend(std)}
            className="px-3 rounded-xl bg-orange-100 text-orange-600 font-bold hover:bg-orange-600 hover:text-white transition-colors"
          >
            {std.accountStatus?.status === "Suspended"
              ? "Unsuspend"
              : "Suspend"}
          </button>
        )}
      </div>
    </div>
  );
}
