export default function ActivitiesTab({ data }) {
  return (
    <div className="grid grid-cols-1 gap-4 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-bold text-slate-700">{item.action}</p>
            <p className="text-xs text-slate-500">
              {new Date(item.timestamp).toDateString()}
            </p>
          </div>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">
            {item.actor}
          </span>
        </div>
      ))}
    </div>
  );
}
