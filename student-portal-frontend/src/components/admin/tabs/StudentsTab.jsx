import { InfoRow } from "../shared/SharedComponents";

export default function StudentsTab({ data, subTab, onReadMore }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-fade-in">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
              {item.username?.[0]}
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{item.username}</h4>
              <p className="text-xs text-slate-500">{item.enrollmentNo}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-600">
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
            className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-colors"
          >
            Read More
          </button>
        </div>
      ))}
    </div>
  );
}
