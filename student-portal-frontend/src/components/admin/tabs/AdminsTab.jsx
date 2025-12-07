export default function AdminsTab({ data, onReadMore }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white p-8 rounded-[20px] shadow-sm border border-slate-100 text-center relative hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg shadow-blue-200">
            {item.username?.[0].toUpperCase()}
          </div>
          <h3 className="font-bold text-xl text-slate-800 mb-1">
            {item.username}
          </h3>
          <p className="text-sm text-slate-500 mb-4">{item.email}</p>
          <span className="inline-block bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-100">
            {item.post}
          </span>
          <button
            onClick={() => onReadMore(item)}
            className="w-full mt-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300"
          >
            View Profile
          </button>
        </div>
      ))}
    </div>
  );
}
