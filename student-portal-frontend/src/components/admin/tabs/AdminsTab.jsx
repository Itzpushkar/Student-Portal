export default function AdminsTab({ data, onReadMore }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-3">
            {item.username?.[0]}
          </div>
          <h3 className="font-bold text-slate-800">{item.username}</h3>
          <p className="text-xs text-slate-500 mb-2">{item.email}</p>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
            {item.post}
          </span>
          <button
            onClick={() => onReadMore(item)}
            className="w-full mt-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
          >
            Read More
          </button>
        </div>
      ))}
    </div>
  );
}
