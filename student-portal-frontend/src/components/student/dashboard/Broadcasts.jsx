import { useState, useEffect } from "react";
import { Radio, Megaphone, Calendar } from "lucide-react";

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/broadcasts", {
          credentials: "include",
        });
        if (res.ok) setBroadcasts(await res.json());
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchBroadcasts();
  }, []);

  if (loading)
    return <div className="text-center py-20 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Radio className="text-indigo-600" /> College Announcements
      </h2>

      {broadcasts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm text-slate-400">
          <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
          <p>No active announcements.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {broadcasts.map((cast) => (
            <div
              key={cast._id}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  {cast.title}
                </h3>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(cast.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {cast.message}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between text-xs text-slate-400">
                <span>
                  From:{" "}
                  <strong className="text-indigo-600">
                    {cast.senderName || "Admin"}
                  </strong>
                </span>
                <span>
                  Target: {cast.targetAudience?.branch} (
                  {cast.targetAudience?.semester})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }`}</style>
    </div>
  );
}
