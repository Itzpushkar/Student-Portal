export default function BannedTab({ data, onToggleBan }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => {
        const isBanned = item.accountStatus?.status === "Banned";
        return (
          <div
            key={item._id}
            className={`group bg-white rounded-[20px] p-6 border transition-all duration-300 relative overflow-hidden ${
              isBanned
                ? "border-red-100 shadow-[0_4px_20px_rgba(239,68,68,0.05)]"
                : "border-slate-100 shadow-sm"
            }`}
          >
            {isBanned && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-[100px] -mr-8 -mt-8"></div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-lg overflow-hidden ${
                  isBanned
                    ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-200"
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
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isBanned
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {isBanned ? "BANNED" : "ACTIVE"}
              </span>
              <button
                onClick={() => onToggleBan(item._id)}
                className={`px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  isBanned
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                {isBanned ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
