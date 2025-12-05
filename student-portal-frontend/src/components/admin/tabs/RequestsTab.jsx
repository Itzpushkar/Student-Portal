export default function RequestsTab({ data, onApprove, onReject }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="mb-4">
            <h4 className="font-bold text-slate-800">{item.username}</h4>
            <p className="text-xs text-slate-500 mb-2">{item.email}</p>
          </div>
          <div className="flex gap-2 mb-4">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              {item.branch}
            </span>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              {item.post}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(item._id)}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(item._id)}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
