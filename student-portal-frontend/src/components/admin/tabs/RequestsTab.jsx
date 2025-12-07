export default function RequestsTab({ data, onApprove, onReject }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">
                  {item.username}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  Applied for Sub-Admin
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded uppercase tracking-wider">
                Pending
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-slate-700">{item.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Branch</span>
                <span className="font-medium text-slate-700">
                  {item.branch}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Post</span>
                <span className="font-medium text-slate-700">{item.post}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onApprove(item._id)}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-600 hover:-translate-y-0.5 transition-all"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(item._id)}
              className="flex-1 py-3 bg-white border border-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all"
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="col-span-full py-20 text-center text-slate-400 font-medium">
          No pending requests at the moment.
        </div>
      )}
    </div>
  );
}
