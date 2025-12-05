import { InfoRow } from "../shared/SharedComponents";

export default function PassoutTab({ data, onReadMore }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div>
              <h4 className="font-bold text-slate-800">{item.username}</h4>
              <p className="text-xs text-slate-500">{item.email}</p>
            </div>
          </div>
          <InfoRow label="Enrollment" value={item.enrollmentNo} />
          <button
            onClick={() => onReadMore(item)}
            className="w-full mt-4 py-2 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
          >
            Read Details
          </button>
        </div>
      ))}
    </div>
  );
}
