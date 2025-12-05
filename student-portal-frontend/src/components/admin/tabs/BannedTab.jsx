export default function BannedTab({ data, onToggleBan }) {
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
          <div className="flex items-center justify-between mt-4">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-600">
              BANNED
            </span>
            <button
              onClick={() => onToggleBan(item._id)}
              className="text-xs font-bold text-green-600 hover:underline"
            >
              Unban
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
