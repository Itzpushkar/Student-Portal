import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // States
  const [activeTab, setActiveTab] = useState("promotions");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.role === "super-admin";

  // --- POLLING & FETCH ---
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const opts = { credentials: "include" };
    try {
      // 1. Promotions (Both Roles)
      const promRes = await fetch(
        "http://localhost:5000/api/user/admin/pending-promotions",
        opts
      );
      if (promRes.ok) setPendingRequests(await promRes.json());

      // 2. Students (Both Roles - Backend filters by branch automatically)
      const stdRes = await fetch(
        "http://localhost:5000/api/admin/all-students",
        opts
      );
      if (stdRes.ok) setStudents(await stdRes.json());

      // 3. Pending Admins (Super Admin Only)
      if (isSuperAdmin) {
        const admRes = await fetch(
          "http://localhost:5000/api/admin/pending-admins",
          opts
        );
        if (admRes.ok) setPendingAdmins(await admRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleAction = async (url, body) => {
    if (!confirm("Confirm action?")) return;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      fetchData(false);
    } catch (e) {
      alert("Error");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* SIDEBAR */}
      <aside
        className={`w-64 text-white flex flex-col fixed h-full z-10 ${
          isSuperAdmin ? "bg-slate-900" : "bg-indigo-900"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">
            {isSuperAdmin ? "SUPER ADMIN" : "BRANCH ADMIN"}
          </h1>
          <p className="text-xs opacity-70 mt-1">
            {user?.branch === "ALL" ? "Main Campus" : `${user?.branch} Dept`}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Shared Tabs */}
          <NavBtn
            label="Promotions"
            count={pendingRequests.length}
            active={activeTab === "promotions"}
            onClick={() => setActiveTab("promotions")}
          />
          <NavBtn
            label="Students"
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
          />

          {/* Super Admin Only Tab */}
          {isSuperAdmin && (
            <NavBtn
              label="Manage Admins"
              count={pendingAdmins.length}
              active={activeTab === "admins"}
              onClick={() => setActiveTab("admins")}
            />
          )}
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-white w-full text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-xl shadow p-6 min-h-[500px]">
          {/* --- TAB: PROMOTIONS --- */}
          {activeTab === "promotions" && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                Promotion Requests
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-400">No pending requests.</p>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex justify-between items-center p-4 border-b hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-bold">
                        {req.userId?.personalDetails?.fullName || "Student"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Sem {req.currentSemester} → {req.requestedSemester}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          handleAction(
                            "http://localhost:5000/api/user/admin/approve-promotion",
                            { requestId: req._id, decision: "approved" }
                          )
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleAction(
                            "http://localhost:5000/api/user/admin/approve-promotion",
                            { requestId: req._id, decision: "rejected" }
                          )
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- TAB: STUDENTS --- */}
          {activeTab === "students" && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                {isSuperAdmin ? "All Students" : `Students (${user?.branch})`}
              </h2>
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-sm text-gray-500">
                    <th className="p-3">Name</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((std) => (
                    <tr key={std._id} className="border-b">
                      <td className="p-3">
                        <div className="font-bold">
                          {std.personalDetails?.fullName || std.username}
                        </div>
                        <div className="text-xs text-gray-400">
                          {std.enrollmentNo}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {std.personalDetails?.branch || "N/A"}
                      </td>
                      <td className="p-3">
                        {std.accountStatus?.isDisabled ? (
                          <button
                            onClick={() =>
                              handleAction(
                                "http://localhost:5000/api/admin/enable-user",
                                { userId: std._id }
                              )
                            }
                            className="text-green-600 text-sm hover:underline"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleAction(
                                "http://localhost:5000/api/admin/disable-user",
                                {
                                  userId: std._id,
                                  days: 7,
                                  reason: "Admin Action",
                                }
                              )
                            }
                            className="text-red-600 text-sm hover:underline"
                          >
                            Ban (7 Days)
                          </button>
                        )}
                        {/* Super Admin Delete Button */}
                        {isSuperAdmin && (
                          <button
                            onClick={() =>
                              handleAction(
                                "http://localhost:5000/api/admin/delete-user",
                                { userId: std._id }
                              )
                            }
                            className="ml-4 text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- TAB: ADMINS (SUPER ONLY) --- */}
          {activeTab === "admins" && isSuperAdmin && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                Pending Sub-Admins
              </h2>
              {pendingAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex justify-between items-center p-4 border-b"
                >
                  <div>
                    <p className="font-bold">{admin.username}</p>
                    <p className="text-sm text-gray-500">
                      {admin.email} • {admin.branch} Dept
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        handleAction(
                          "http://localhost:5000/api/admin/approve-admin",
                          { pendingAdminId: admin._id, decision: "approve" }
                        )
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleAction(
                          "http://localhost:5000/api/admin/approve-admin",
                          { pendingAdminId: admin._id, decision: "reject" }
                        )
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingAdmins.length === 0 && (
                <p className="text-gray-400">No new admin requests.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavBtn({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-4 py-3 rounded transition-all ${
        active ? "bg-white/20 font-bold" : "hover:bg-white/10"
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
