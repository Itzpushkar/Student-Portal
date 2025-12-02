import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("promotions");

  // Data State
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-Refresh (Hot Reloading) every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false); // Silent refresh
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const opts = { credentials: "include" };

      // 1. Fetch Promotions (from User Routes - userController)
      const promRes = await fetch(
        "http://localhost:5000/api/user/admin/pending-promotions",
        opts
      );
      if (promRes.ok) {
        const data = await promRes.json();
        setPendingRequests(data);
      }

      // 2. Fetch Students (from Admin Routes - adminController)
      const stdRes = await fetch(
        "http://localhost:5000/api/admin/all-students",
        opts
      );
      if (stdRes.ok) {
        const data = await stdRes.json();
        setAllStudents(data);
      }

      // 3. Fetch Admins (from Admin Routes - adminController)
      const admRes = await fetch(
        "http://localhost:5000/api/admin/pending-admins",
        opts
      );
      if (admRes.ok) {
        const data = await admRes.json();
        setPendingAdmins(data);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // --- ACTIONS (Hot Reloading Triggered via fetchData) ---

  const handleDecision = async (requestId, decision) => {
    if (!confirm(`Confirm ${decision}?`)) return;
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/admin/approve-promotion",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId, decision }),
        }
      );
      if (res.ok) fetchData(false); // Hot Reload
      else alert("Action failed");
    } catch (e) {
      alert("Network Error");
    }
  };

  const handleUserStatus = async (userId, action) => {
    // action: 'disable-user' or 'enable-user'
    const reason = action === "disable-user" ? prompt("Reason for ban:") : null;
    if (action === "disable-user" && !reason) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${action}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, days: 7, reason }),
      });
      if (res.ok) fetchData(false); // Hot Reload
      else alert("Action failed");
    } catch (e) {
      alert("Network Error");
    }
  };

  const handleAdminApproval = async (pendingAdminId, decision) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/approve-admin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingAdminId, decision }),
      });
      if (res.ok) fetchData(false); // Hot Reload
      else alert("Action failed");
    } catch (e) {
      alert("Network Error");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("promotions")}
            className={`nav-btn ${
              activeTab === "promotions" ? "bg-blue-600" : ""
            }`}
          >
            Promotions
            {pendingRequests.length > 0 && (
              <span className="badge">{pendingRequests.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`nav-btn ${
              activeTab === "students" ? "bg-blue-600" : ""
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`nav-btn ${activeTab === "admins" ? "bg-blue-600" : ""}`}
          >
            Admins
            {pendingAdmins.length > 0 && (
              <span className="badge">{pendingAdmins.length}</span>
            )}
          </button>
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="text-red-400 w-full text-left p-2 hover:bg-slate-800 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-xl shadow p-6 min-h-[500px]">
          {loading && (
            <p className="text-center text-gray-500 py-10">Loading Data...</p>
          )}

          {/* PROMOTIONS */}
          {!loading && activeTab === "promotions" && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Pending Promotions ({pendingRequests.length})
              </h2>
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex justify-between items-center border-b p-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold">
                      {req.userId?.personalDetails?.fullName ||
                        req.userId?.username ||
                        "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sem {req.currentSemester} → {req.requestedSemester}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleDecision(req._id, "approved")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(req._id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-gray-500">No pending requests.</p>
              )}
            </div>
          )}

          {/* STUDENTS */}
          {!loading && activeTab === "students" && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                All Students ({allStudents.length})
              </h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3">Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allStudents.map((std) => (
                    <tr key={std._id} className="border-b hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-medium">
                          {std.personalDetails?.fullName || std.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {std.enrollmentNo}
                        </div>
                      </td>
                      <td className="p-3">
                        {std.accountStatus?.isDisabled ? (
                          <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-xs">
                            BANNED
                          </span>
                        ) : (
                          <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {std.accountStatus?.isDisabled ? (
                          <button
                            onClick={() =>
                              handleUserStatus(std._id, "enable-user")
                            }
                            className="text-green-600 hover:underline"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUserStatus(std._id, "disable-user")
                            }
                            className="text-red-600 hover:underline"
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ADMINS */}
          {!loading && activeTab === "admins" && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Pending Admin Approvals
              </h2>
              {pendingAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex justify-between items-center border-b p-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold">{admin.username}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAdminApproval(admin._id, "approve")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAdminApproval(admin._id, "reject")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingAdmins.length === 0 && (
                <p className="text-gray-500">No pending admin requests.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .nav-btn { width: 100%; text-align: left; padding: 10px 16px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; transition: background 0.2s; }
        .nav-btn:hover { background-color: #334155; }
        .badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 99px; font-size: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}
