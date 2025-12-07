import { InfoRow } from "../shared/SharedComponents";

export default function StudentsTab({ data, subTab, onReadMore }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="group bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-50">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-200 overflow-hidden">
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
              <h4 className="font-bold text-slate-800 text-lg leading-tight">
                {item.username}
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                {item.enrollmentNo}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6 text-sm text-slate-600">
            {subTab === "personal" ? (
              <>
                <InfoRow label="Mobile" value={item.personalDetails?.contact} />
                <InfoRow label="Email" value={item.email} truncate />
              </>
            ) : (
              <>
                <InfoRow label="Current Sem" value={item.currentSemester} />
                <InfoRow
                  label="CGPA"
                  value={item.academicDetails?.[item.currentSemester - 1]?.gpa}
                />
                <InfoRow
                  label="Backlogs"
                  value={
                    item.academicDetails?.[item.currentSemester - 1]?.backlogs
                  }
                />
              </>
            )}
          </div>
          <button
            onClick={() => onReadMore(item)}
            className="w-full py-3 bg-slate-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            Read Details
          </button>
        </div>
      ))}
    </div>
  );
}
