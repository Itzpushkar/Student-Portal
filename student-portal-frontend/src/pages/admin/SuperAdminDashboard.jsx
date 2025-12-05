// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/useAuth";
// import { useNavigate } from "react-router-dom";
// import { Icons } from "../../components/admin/shared/SharedComponents";

// // --- MODULAR IMPORTS ---
// import AdminSidebar from "../../components/admin/shared/AdminSidebar";
// import DashboardFilters from "../../components/admin/dashboard/DashboardFilters";
// import UserDetailModal from "../../components/admin/modals/UserDetailModal";
// import SuspendModal from "../../components/admin/modals/SuspendModal";

// // --- TABS IMPORTS ---
// import StudentsTab from "../../components/admin/tabs/StudentsTab";
// import AdminsTab from "../../components/admin/tabs/AdminsTab";
// import PassoutTab from "../../components/admin/tabs/PassoutTab";
// import ActivitiesTab from "../../components/admin/tabs/ActivitiesTab";
// import BannedTab from "../../components/admin/tabs/BannedTab";
// import SuspendedTab from "../../components/admin/tabs/SuspendedTab";
// import RequestsTab from "../../components/admin/tabs/RequestsTab";

// export default function SuperAdminDashboard() {
//   const { user, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   // --- STATE ---
//   const [activeTab, setActiveTab] = useState("students");
//   const [subTab, setSubTab] = useState("personal");

//   // Filter State
//   const [branch, setBranch] = useState("");
//   const [semester, setSemester] = useState("");
//   const [year, setYear] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activityDate, setActivityDate] = useState("");

//   // Data & Modal State
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [modalMode, setModalMode] = useState("read");
//   const [showSuspendModal, setShowSuspendModal] = useState(false);
//   const [suspendForm, setSuspendForm] = useState({
//     duration: "1 Day",
//     reason: "",
//   });
//   const [userToSuspend, setUserToSuspend] = useState(null);

//   // --- CONFIG ---
//   const tabs = [
//     { id: "students", label: "Student", icon: Icons.Student },
//     { id: "admins", label: "Admins", icon: Icons.Admin },
//     { id: "passout", label: "Pass-out Students", icon: Icons.Passout },
//     { id: "activities", label: "Activities", icon: Icons.Activity },
//     { id: "banned", label: "Banned Student", icon: Icons.Ban },
//     { id: "suspended", label: "Suspend Student", icon: Icons.Suspend },
//     { id: "requests", label: "Admin Request", icon: Icons.Request },
//     {
//       id: "broadcast-student",
//       label: "Broadcast (Student)",
//       icon: Icons.Broadcast,
//       wip: true,
//     },
//     {
//       id: "broadcast-admin",
//       label: "Broadcast (Admin)",
//       icon: Icons.Broadcast,
//       wip: true,
//     },
//     { id: "office", label: "Admin Office", icon: Icons.Settings, wip: true },
//   ];

//   // --- API CALLS ---
//   const fetchData = async () => {
//     if (tabs.find((t) => t.id === activeTab)?.wip) return;

//     // REQUIREMENT: For Student/Passout/Banned/Suspended, Branch is MANDATORY to show list.
//     // However, for ADMINS, we want to show ALL by default if no branch is selected.
//     if (
//       ["students", "passout", "banned", "suspended"].includes(activeTab) &&
//       !branch
//     ) {
//       setData([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       let endpoint = "all-students";
//       let query = `?branch=${branch}`;
//       if (semester) query += `&semester=${semester}`;
//       if (year) query += `&year=${year}`;

//       if (activeTab === "admins") endpoint = "sub-admins";
//       if (activeTab === "requests") endpoint = "pending-admins";
//       if (activeTab === "activities") endpoint = "activities";
//       if (activeTab === "passout") endpoint = `passout-students${query}`;
//       if (["students", "banned", "suspended"].includes(activeTab))
//         endpoint = `all-students${query}`;

//       const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
//         credentials: "include",
//       });
//       if (res.ok) {
//         let result = await res.json();

//         // Client-side Filtering
//         if (activeTab === "banned")
//           result = result.filter((u) => u.accountStatus?.status === "Banned");
//         if (activeTab === "suspended")
//           result = result.filter(
//             (u) => u.accountStatus?.status === "Suspended"
//           );
//         if (activeTab === "students")
//           result = result.filter((u) => u.accountStatus?.status === "Active");

//         // FIX: For Admins, only filter if a branch is actually selected. Otherwise show all.
//         if (activeTab === "admins" && branch)
//           result = result.filter((a) => a.branch === branch);

//         if (activeTab === "activities") {
//           if (searchQuery)
//             result = result.filter((log) =>
//               log.details.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//           if (activityDate)
//             result = result.filter((log) =>
//               log.timestamp.startsWith(activityDate)
//             );
//         }
//         setData(result);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [activeTab, branch, semester, year, searchQuery, activityDate]);

//   // --- HANDLERS ---
//   const handleAction = async (endpoint, body) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(body),
//       });
//       if (res.ok) {
//         fetchData();
//         setShowSuspendModal(false);
//         setSelectedUser(null);
//       }
//     } catch (e) {
//       alert("Action Failed");
//     }
//   };

//   const toggleBan = (userId) => handleAction("toggle-ban", { userId });
//   const onUnsuspend = (userId) =>
//     handleAction("suspend-user", { userId, duration: "Until I unsuspend" });

//   const initiateSuspend = (userId) => {
//     setUserToSuspend(userId);
//     setSuspendForm({ duration: "1 Day", reason: "" });
//     setShowSuspendModal(true);
//   };

//   const handleUpdateDetails = () => {
//     alert("Details Updated Successfully!");
//     setModalMode("read");
//     fetchData();
//   };

//   const handleLogout = () => {
//     logoutUser();
//     navigate("/");
//   };

//   // --- RENDER CONTENT SWITCHER ---
//   const renderTabContent = () => {
//     const isWip = tabs.find((t) => t.id === activeTab)?.wip;
//     if (isWip)
//       return (
//         <div className="h-96 flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-dashed rounded-3xl">
//           Work in Progress
//         </div>
//       );

//     if (loading)
//       return (
//         <div className="text-center py-20 text-slate-400">
//           Loading Records...
//         </div>
//       );

//     if (data.length === 0) {
//       return (
//         <div className="text-center py-20 text-slate-400">
//           {!branch &&
//           ["students", "passout", "banned", "suspended"].includes(activeTab)
//             ? "Please select a Branch."
//             : "No records found."}
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case "students":
//         return (
//           <StudentsTab
//             data={data}
//             subTab={subTab}
//             onReadMore={(u) => {
//               setSelectedUser(u);
//               setModalMode("read");
//             }}
//           />
//         );
//       case "admins":
//         return (
//           <AdminsTab
//             data={data}
//             onReadMore={(u) => {
//               setSelectedUser(u);
//               setModalMode("read");
//             }}
//           />
//         );
//       case "passout":
//         return (
//           <PassoutTab
//             data={data}
//             onReadMore={(u) => {
//               setSelectedUser(u);
//               setModalMode("read");
//             }}
//           />
//         );
//       case "activities":
//         return <ActivitiesTab data={data} />;
//       case "banned":
//         return <BannedTab data={data} onToggleBan={toggleBan} />;
//       case "suspended":
//         return <SuspendedTab data={data} onUnsuspend={onUnsuspend} />;
//       case "requests":
//         return (
//           <RequestsTab
//             data={data}
//             onApprove={(id) => handleAction("approve-admin", { adminId: id })}
//             onReject={(id) => handleAction("reject-admin", { adminId: id })}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#F5F7FA] font-sans overflow-hidden">
//       {/* 1. MODULAR SIDEBAR */}
//       <AdminSidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         onLogout={handleLogout}
//         tabs={tabs}
//       />

//       {/* 2. MAIN CONTENT */}
//       <main className="flex-1 overflow-y-auto p-8 relative bg-[#F5F7FA]">
//         {/* SUB TABS (Student Only) */}
//         {activeTab === "students" && (
//           <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4">
//             <button
//               onClick={() => setSubTab("personal")}
//               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
//                 subTab === "personal"
//                   ? "bg-indigo-600 text-white shadow-lg"
//                   : "bg-white text-slate-500 hover:bg-slate-50"
//               }`}
//             >
//               Personal Details
//             </button>
//             <button
//               onClick={() => setSubTab("academic")}
//               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
//                 subTab === "academic"
//                   ? "bg-indigo-600 text-white shadow-lg"
//                   : "bg-white text-slate-500 hover:bg-slate-50"
//               }`}
//             >
//               Academic Details
//             </button>
//           </div>
//         )}

//         <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">
//           {activeTab.replace("-", " ")}
//         </h2>

//         {/* 3. MODULAR FILTERS */}
//         <DashboardFilters
//           activeTab={activeTab}
//           branch={branch}
//           setBranch={setBranch}
//           semester={semester}
//           setSemester={setSemester}
//           year={year}
//           setYear={setYear}
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           activityDate={activityDate}
//           setActivityDate={setActivityDate}
//           tabs={tabs}
//         />

//         {/* 4. MODULAR TAB CONTENT */}
//         {renderTabContent()}
//       </main>

//       {/* 5. MODULAR MODALS */}
//       <UserDetailModal
//         user={selectedUser}
//         onClose={() => setSelectedUser(null)}
//         onUpdate={handleUpdateDetails}
//         modalMode={modalMode}
//         setModalMode={setModalMode}
//       />

//       <SuspendModal
//         isOpen={showSuspendModal}
//         onClose={() => setShowSuspendModal(false)}
//         onConfirm={async () => {
//           if (!suspendForm.reason) return alert("Please enter a reason");
//           await handleAction("suspend-user", {
//             userId: userToSuspend,
//             ...suspendForm,
//           });
//         }}
//         form={suspendForm}
//         setForm={setSuspendForm}
//       />

//       <style>{`
//         .filter-select, .filter-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: white; color: #475569; font-weight: 500; transition: all 0.2s; }
//         .filter-select:focus, .filter-input:focus { border-color: #6366f1; ring: 2px solid #6366f1; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../components/admin/shared/SharedComponents";

// --- MODULAR IMPORTS ---
import AdminSidebar from "../../components/admin/shared/AdminSidebar";
import DashboardFilters from "../../components/admin/dashboard/DashboardFilters";
import UserDetailModal from "../../components/admin/modals/UserDetailModal";
import SuspendModal from "../../components/admin/modals/SuspendModal";

// --- TABS IMPORTS ---
import StudentsTab from "../../components/admin/tabs/StudentsTab";
import AdminsTab from "../../components/admin/tabs/AdminsTab";
import PassoutTab from "../../components/admin/tabs/PassoutTab";
import ActivitiesTab from "../../components/admin/tabs/ActivitiesTab";
import BannedTab from "../../components/admin/tabs/BannedTab";
import SuspendedTab from "../../components/admin/tabs/SuspendedTab";
import RequestsTab from "../../components/admin/tabs/RequestsTab";

export default function SuperAdminDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("students");
  const [subTab, setSubTab] = useState("personal");

  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activityDate, setActivityDate] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("read");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendForm, setSuspendForm] = useState({
    duration: "1 Day",
    reason: "",
  });
  const [userToSuspend, setUserToSuspend] = useState(null);

  const tabs = [
    { id: "students", label: "Student", icon: Icons.Student },
    { id: "admins", label: "Admins", icon: Icons.Admin },
    { id: "passout", label: "Pass-out Students", icon: Icons.Passout },
    { id: "activities", label: "Activities", icon: Icons.Activity },
    { id: "banned", label: "Banned Student", icon: Icons.Ban },
    { id: "suspended", label: "Suspend Student", icon: Icons.Suspend },
    { id: "requests", label: "Admin Request", icon: Icons.Request },
    {
      id: "broadcast-student",
      label: "Broadcast (Student)",
      icon: Icons.Broadcast,
      wip: true,
    },
    {
      id: "broadcast-admin",
      label: "Broadcast (Admin)",
      icon: Icons.Broadcast,
      wip: true,
    },
    { id: "office", label: "Admin Office", icon: Icons.Settings, wip: true },
  ];

  const fetchData = async () => {
    if (tabs.find((t) => t.id === activeTab)?.wip) return;

    // Logic: If Student/Passout/Banned/Suspended and NO branch selected -> Show Empty or Default list
    // Exception: Banned/Suspended default view (no filter) should show ALL banned users.
    const isSpecialTab = ["banned", "suspended"].includes(activeTab);

    // If regular student tab and no branch, clear data
    if (activeTab === "students" && !branch) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      let endpoint = "all-students";
      let query = `?branch=${branch}`;
      if (semester) query += `&semester=${semester}`;
      if (year) query += `&year=${year}`;

      if (activeTab === "admins") endpoint = "sub-admins";
      if (activeTab === "requests") endpoint = "pending-admins";
      if (activeTab === "activities") endpoint = "activities";
      if (activeTab === "passout") endpoint = `passout-students${query}`;
      if (["students", "banned", "suspended"].includes(activeTab))
        endpoint = `all-students${query}`;

      const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        credentials: "include",
      });
      if (res.ok) {
        let result = await res.json();

        // --- ADVANCED FILTERING LOGIC ---

        if (activeTab === "banned") {
          // Logic: If Filter Selected -> Show All (so we can ban new ones).
          // Logic: If No Filter -> Show ONLY Banned.
          if (branch) {
            // Show ALL, but Banned ones will have special UI in the tab component
          } else {
            result = result.filter((u) => u.accountStatus?.status === "Banned");
          }
        }

        if (activeTab === "suspended") {
          if (branch) {
            // Show ALL mixed
          } else {
            result = result.filter(
              (u) => u.accountStatus?.status === "Suspended"
            );
          }
        }

        if (activeTab === "students")
          result = result.filter((u) => u.accountStatus?.status === "Active");
        if (activeTab === "admins" && branch)
          result = result.filter((a) => a.branch === branch);

        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, branch, semester, year, searchQuery, activityDate]);

  const handleAction = async (endpoint, body) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchData();
        setShowSuspendModal(false);
        setSelectedUser(null);
      }
    } catch (e) {
      alert("Action Failed");
    }
  };

  const toggleBan = (userId) => handleAction("toggle-ban", { userId });
  const onUnsuspend = (userId) =>
    handleAction("suspend-user", { userId, duration: "Until I unsuspend" });

  const initiateSuspend = (userId) => {
    setUserToSuspend(userId);
    setSuspendForm({ duration: "1 Day", reason: "" });
    setShowSuspendModal(true);
  };

  const handleUpdateDetails = () => {
    alert("Details Updated Successfully!");
    setModalMode("read");
    fetchData();
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const renderTabContent = () => {
    const isWip = tabs.find((t) => t.id === activeTab)?.wip;
    if (isWip)
      return (
        <div className="h-96 flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-dashed rounded-3xl">
          Work in Progress
        </div>
      );

    if (loading)
      return (
        <div className="text-center py-20 text-slate-400">
          Loading Records...
        </div>
      );

    if (data.length === 0) {
      const isBannedOrSuspended = ["banned", "suspended"].includes(activeTab);
      if (isBannedOrSuspended && !branch)
        return (
          <div className="text-center py-20 text-slate-400">
            No {activeTab} students found. Select a branch to find students to{" "}
            {activeTab === "banned" ? "ban" : "suspend"}.
          </div>
        );
      if (activeTab === "students" && !branch)
        return (
          <div className="text-center py-20 text-slate-400">
            Please select a Branch.
          </div>
        );
      return (
        <div className="text-center py-20 text-slate-400">
          No records found.
        </div>
      );
    }

    switch (activeTab) {
      case "students":
        return (
          <StudentsTab
            data={data}
            subTab={subTab}
            onReadMore={(u) => {
              setSelectedUser(u);
              setModalMode("read");
            }}
          />
        );
      case "admins":
        return (
          <AdminsTab
            data={data}
            onReadMore={(u) => {
              setSelectedUser(u);
              setModalMode("read");
            }}
          />
        );
      case "passout":
        return (
          <PassoutTab
            data={data}
            onReadMore={(u) => {
              setSelectedUser(u);
              setModalMode("read");
            }}
          />
        );
      case "activities":
        return <ActivitiesTab data={data} />;
      case "banned":
        return <BannedTab data={data} onToggleBan={toggleBan} />;
      case "suspended":
        return (
          <SuspendedTab
            data={data}
            onUnsuspend={onUnsuspend}
            onSuspend={initiateSuspend}
          />
        );
      case "requests":
        return (
          <RequestsTab
            data={data}
            onApprove={(id) => handleAction("approve-admin", { adminId: id })}
            onReject={(id) => handleAction("reject-admin", { adminId: id })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans overflow-hidden">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        tabs={tabs}
      />
      <main className="flex-1 overflow-y-auto p-8 relative bg-[#F5F7FA]">
        {activeTab === "students" && (
          <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4">
            <button
              onClick={() => setSubTab("personal")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                subTab === "personal"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setSubTab("academic")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                subTab === "academic"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Academic Details
            </button>
          </div>
        )}
        <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">
          {activeTab.replace("-", " ")}
        </h2>
        <DashboardFilters
          activeTab={activeTab}
          branch={branch}
          setBranch={setBranch}
          semester={semester}
          setSemester={setSemester}
          year={year}
          setYear={setYear}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activityDate={activityDate}
          setActivityDate={setActivityDate}
          tabs={tabs}
        />
        {renderTabContent()}
      </main>
      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdate={handleUpdateDetails}
        modalMode={modalMode}
        setModalMode={setModalMode}
      />
      <SuspendModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={async () => {
          if (!suspendForm.reason) return alert("Please enter a reason");
          await handleAction("suspend-user", {
            userId: userToSuspend,
            ...suspendForm,
          });
        }}
        form={suspendForm}
        setForm={setSuspendForm}
      />
      <style>{`.filter-select, .filter-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: white; color: #475569; font-weight: 500; transition: all 0.2s; } .filter-select:focus, .filter-input:focus { border-color: #6366f1; ring: 2px solid #6366f1; } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
