import { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/user/notifications",
          { credentials: "include" }
        );
        if (res.ok) setNotifications(await res.json());
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/user/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" />;
      case "error":
        return <XCircle className="text-red-500" />;
      case "warning":
        return <AlertTriangle className="text-amber-500" />;
      default:
        return <Info className="text-blue-500" />;
    }
  };

  if (loading)
    return <div className="text-center py-20 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Bell className="text-indigo-600" /> Your Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm text-slate-400">
          <Bell size={48} className="mx-auto mb-4 opacity-50" />
          <p>No new notifications.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.isRead
                  ? "bg-white border-slate-100 opacity-70"
                  : "bg-white border-indigo-100 shadow-md border-l-4 border-l-indigo-500"
              }`}
            >
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <h4
                  className={`font-bold ${
                    notif.isRead ? "text-slate-600" : "text-slate-800"
                  }`}
                >
                  {notif.title}
                </h4>
                <p className="text-sm text-slate-500 mt-1">{notif.message}</p>
                <span className="text-xs text-slate-400 mt-3 block">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              {!notif.isRead && (
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }`}</style>
    </div>
  );
}
