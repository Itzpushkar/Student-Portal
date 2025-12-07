// import { useState, useEffect } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate } from "react-router-dom";
// import { LogOut, Pencil, Upload, Save, Quote, School } from "lucide-react";

// export default function DashboardPage() {
//   const { user, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quote, setQuote] = useState("");
//   const [isEditingQuote, setIsEditingQuote] = useState(false);

//   // Profile Editing State
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [profileForm, setProfileForm] = useState({});

//   // Semester Modal
//   const [activeSemester, setActiveSemester] = useState(null); // null = closed, 1,2,3... = open
//   const [semForm, setSemForm] = useState({
//     gpa: "",
//     backlogs: "",
//     remarks: "",
//   });

//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//       return;
//     }

//     // Load local quote
//     const savedQuote = localStorage.getItem(`quote_${user._id}`);
//     if (savedQuote) setQuote(savedQuote);

//     // Initial Fetch
//     fetchUserData();
//   }, [user, navigate]);

//   const fetchUserData = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/user/dashboard", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user._id }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setUserData(data);
//         setProfileForm(data.personalDetails || {});
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveQuote = () => {
//     localStorage.setItem(`quote_${user._id}`, quote);
//     setIsEditingQuote(false);
//   };

//   const handleProfileUpdate = async () => {
//     // Save logic
//     try {
//       const formData = new FormData();
//       formData.append("userId", user._id);
//       Object.keys(profileForm).forEach((key) =>
//         formData.append(key, profileForm[key])
//       );

//       await fetch("http://localhost:5000/api/user/personal", {
//         method: "POST",
//         credentials: "include",
//         body: formData, // FormData handles file upload automatically if present
//       });

//       setIsEditingProfile(false);
//       fetchUserData(); // Refresh
//       alert("Profile Updated!");
//     } catch (e) {
//       alert("Update failed");
//     }
//   };

//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("userId", user._id);
//     formData.append("profilePhoto", file);

//     // We reuse the personal details endpoint which handles photos
//     await fetch("http://localhost:5000/api/user/personal", {
//       method: "POST",
//       credentials: "include",
//       body: formData,
//     });
//     fetchUserData();
//   };

//   const handleSemesterSave = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("userId", user._id);
//       formData.append("semester", activeSemester);
//       formData.append("gpa", semForm.gpa);
//       formData.append("backlogs", semForm.backlogs);

//       await fetch("http://localhost:5000/api/user/academic", {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });
//       setActiveSemester(null);
//       fetchUserData();
//     } catch (e) {
//       alert("Failed to save");
//     }
//   };

//   const calculateCGPA = () => {
//     if (!userData?.academicDetails?.length) return "0.00";
//     let total = userData.academicDetails.reduce(
//       (acc, curr) => acc + (Number(curr.gpa) || 0),
//       0
//     );
//     return (total / userData.academicDetails.length).toFixed(2);
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white p-6 font-sans text-slate-800 relative">
//       {/* MAIN GRID LAYOUT (Image 7) */}
//       <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* === 1. LEFT COLUMN (Quote + Academics) === */}
//         <div className="lg:col-span-3 space-y-6 flex flex-col">
//           {/* Quote Card */}
//           <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm min-h-[150px] flex flex-col justify-center items-center text-center relative group">
//             <Quote
//               className="text-indigo-200 absolute top-4 left-4"
//               size={40}
//             />
//             {isEditingQuote ? (
//               <div className="w-full">
//                 <textarea
//                   className="w-full p-2 border rounded mb-2 text-sm"
//                   value={quote}
//                   onChange={(e) => setQuote(e.target.value)}
//                   placeholder="Type quote..."
//                 />
//                 <button
//                   onClick={saveQuote}
//                   className="text-xs bg-indigo-600 text-white px-3 py-1 rounded"
//                 >
//                   Save
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <p className="italic text-slate-600 font-medium z-10">
//                   "{quote || "Add your favorite quote here"}"
//                 </p>
//                 <button
//                   onClick={() => setIsEditingQuote(true)}
//                   className="mt-4 text-xs text-indigo-500 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   {quote ? "Edit Quote" : "Add Quote"}
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Academics Section */}
//           <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm flex-1">
//             <div className="flex items-center gap-2 mb-4">
//               <School className="text-indigo-600" />
//               <h3 className="font-bold text-lg">Academics</h3>
//             </div>

//             {/* Horizontal Semester Scroll */}
//             <div className="flex flex-col gap-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//               {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
//                 const isUnlocked =
//                   sem === 1 ||
//                   userData.academicDetails.some(
//                     (d) => d.semester === sem - 1 && d.isCompleted
//                   );
//                 const isCompleted = userData.academicDetails.some(
//                   (d) => d.semester === sem && d.isCompleted
//                 );

//                 return (
//                   <button
//                     key={sem}
//                     disabled={!isUnlocked}
//                     onClick={() => setActiveSemester(sem)}
//                     className={`w-full py-4 rounded-xl font-bold text-left px-6 transition-all border-2 ${
//                       isCompleted
//                         ? "bg-green-100 border-green-200 text-green-800"
//                         : isUnlocked
//                         ? "bg-white border-indigo-100 hover:border-indigo-500 text-indigo-900 shadow-sm"
//                         : "bg-slate-200 border-transparent text-slate-400 cursor-not-allowed"
//                     }`}
//                   >
//                     Semester {sem} {isCompleted && "✓"}
//                   </button>
//                 );
//               })}

//               {/* Request Promotion Button */}
//               <button className="w-full py-4 mt-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-black transition-all">
//                 REQUEST
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* === 2. CENTER COLUMN (Welcome + Notifs + Footer) === */}
//         <div className="lg:col-span-5 flex flex-col gap-6">
//           {/* Welcome Card */}
//           <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-lg text-center relative overflow-hidden">
//             <div className="relative z-10">
//               <h2 className="text-3xl font-extrabold mb-1">Welcome Back</h2>
//               <h3 className="text-xl font-light opacity-90">
//                 {userData?.personalDetails?.fullName || user.username}
//               </h3>
//               <div className="mt-6 inline-block bg-white/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/30">
//                 <span className="font-bold text-yellow-300">Backlogs: </span>
//                 <span className="text-white font-mono text-lg ml-2">
//                   {userData?.academicDetails?.reduce(
//                     (acc, curr) => acc + (Number(curr.backlogs) || 0),
//                     0
//                   )}
//                 </span>
//               </div>
//             </div>
//             {/* Decoration Circles */}
//             <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
//             <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-indigo-400/30 rounded-full blur-xl"></div>
//           </div>

//           {/* Notifications Box */}
//           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex-1 p-6 min-h-[300px]">
//             <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm mb-4">
//               Notifications
//             </h3>
//             <div className="space-y-4">
//               {/* Mock Notifications */}
//               <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-indigo-500">
//                 <p className="text-sm font-semibold">System Update</p>
//                 <p className="text-xs text-slate-500">
//                   Your profile was successfully created.
//                 </p>
//               </div>
//               {userData?.promotionStatus === "pending" && (
//                 <div className="p-4 bg-yellow-50 rounded-2xl border-l-4 border-yellow-500">
//                   <p className="text-sm font-semibold text-yellow-800">
//                     Promotion Pending
//                   </p>
//                   <p className="text-xs text-yellow-600">
//                     Admin approval is required for next semester.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* VPMP Link Footer */}
//           <a
//             href="https://vpmp.ac.in"
//             target="_blank"
//             className="block text-center py-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-medium text-sm"
//           >
//             VPMP Website Link ↗
//           </a>
//         </div>

//         {/* === 3. RIGHT COLUMN (Profile) === */}
//         <div className="lg:col-span-4 flex flex-col gap-6">
//           <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg h-full flex flex-col items-center relative">
//             {/* Edit Toggle */}
//             <button
//               onClick={() => setIsEditingProfile(!isEditingProfile)}
//               className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
//                 isEditingProfile
//                   ? "bg-indigo-100 text-indigo-600"
//                   : "bg-slate-100 text-slate-400 hover:text-slate-800"
//               }`}
//             >
//               <Pencil size={20} />
//             </button>

//             {/* Profile Photo */}
//             <div className="relative group w-32 h-32 mb-6">
//               <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner bg-slate-100 flex items-center justify-center">
//                 {userData?.personalDetails?.profilePhoto ? (
//                   <img
//                     src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-slate-300 text-4xl">👤</span>
//                 )}
//               </div>

//               {/* Hover Overlay for Upload */}
//               <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
//                 <div className="text-center">
//                   <Upload size={20} className="mx-auto mb-1" />
//                   <span className="text-[10px] font-bold uppercase">
//                     Update
//                   </span>
//                 </div>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
//               </label>
//             </div>

//             {/* Info Fields */}
//             <div className="w-full space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
//               <InfoField
//                 label="Student Name"
//                 value={profileForm.fullName}
//                 isEditing={isEditingProfile}
//                 onChange={(v) =>
//                   setProfileForm({ ...profileForm, fullName: v })
//                 }
//               />
//               <InfoField
//                 label="Date of Birth"
//                 value={profileForm.dob}
//                 isEditing={isEditingProfile}
//                 type="date"
//                 onChange={(v) => setProfileForm({ ...profileForm, dob: v })}
//               />
//               <InfoField
//                 label="Enrollment No"
//                 value={user.enrollmentNo}
//                 isEditing={false}
//               />
//               <InfoField
//                 label="Email ID"
//                 value={user.email}
//                 isEditing={false}
//               />
//               <InfoField
//                 label="Course"
//                 value={profileForm.course}
//                 isEditing={isEditingProfile}
//                 onChange={(v) => setProfileForm({ ...profileForm, course: v })}
//               />
//               <InfoField
//                 label="Branch"
//                 value={profileForm.branch}
//                 isEditing={isEditingProfile}
//                 onChange={(v) => setProfileForm({ ...profileForm, branch: v })}
//               />
//               <InfoField
//                 label="Current Sem"
//                 value={userData?.currentSemester}
//                 isEditing={false}
//               />

//               {/* CGPA (Auto Calculated) */}
//               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
//                 <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
//                   CGPA
//                 </span>
//                 <div className="text-3xl font-extrabold text-indigo-700">
//                   {calculateCGPA()}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="w-full mt-6 space-y-3">
//               {isEditingProfile && (
//                 <button
//                   onClick={handleProfileUpdate}
//                   className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 flex items-center justify-center gap-2"
//                 >
//                   <Save size={18} /> Update Data
//                 </button>
//               )}
//               <button
//                 onClick={() => {
//                   logoutUser();
//                   navigate("/");
//                 }}
//                 className="w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-100 flex items-center justify-center gap-2"
//               >
//                 <LogOut size={18} /> Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* === MODAL: SEMESTER FORM === */}
//       {activeSemester && (
//         <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xl flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-100 animate-fade-in">
//             <h3 className="text-2xl font-bold text-slate-800 mb-6">
//               Semester {activeSemester} Details
//             </h3>
//             <form onSubmit={handleSemesterSave} className="space-y-4">
//               <div>
//                 <label className="text-sm font-bold text-slate-500 ml-2">
//                   GPA
//                 </label>
//                 <input
//                   className="pill-input"
//                   type="number"
//                   step="0.01"
//                   max="10"
//                   required
//                   onChange={(e) =>
//                     setSemForm({ ...semForm, gpa: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-bold text-slate-500 ml-2">
//                   Active Backlogs
//                 </label>
//                 <input
//                   className="pill-input"
//                   type="number"
//                   required
//                   onChange={(e) =>
//                     setSemForm({ ...semForm, backlogs: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-bold text-slate-500 ml-2">
//                   Remarks
//                 </label>
//                 <input
//                   className="pill-input"
//                   onChange={(e) =>
//                     setSemForm({ ...semForm, remarks: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="flex gap-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setActiveSemester(null)}
//                   className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
//                 >
//                   Cancel
//                 </button>
//                 <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .pill-input { width: 100%; padding: 12px 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; outline: none; transition: 0.2s; }
//         .pill-input:focus { border-color: #4f46e5; background: white; }
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
//       `}</style>
//     </div>
//   );
// }

// // Helper Component for Profile Fields
// function InfoField({ label, value, isEditing, onChange, type = "text" }) {
//   return (
//     <div className="flex flex-col">
//       <span className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1">
//         {label}
//       </span>
//       {isEditing ? (
//         <input
//           type={type}
//           className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         <div className="p-2 px-3 bg-white border border-transparent rounded-lg text-sm font-medium text-slate-700 truncate">
//           {value || "-"}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate } from "react-router-dom";
// import PersonalDetailsForm from "../components/PersonalDetailsForm";
// import AcademicDetailsForm from "../components/AcademicDetailsForm";

// // --- INLINE ICONS (Clean & Modern) ---
// const IconDashboard = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect width="7" height="9" x="3" y="3" rx="1" />
//     <rect width="7" height="5" x="14" y="3" rx="1" />
//     <rect width="7" height="9" x="14" y="12" rx="1" />
//     <rect width="7" height="5" x="3" y="16" rx="1" />
//   </svg>
// );
// const IconUser = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//     <circle cx="12" cy="7" r="4" />
//   </svg>
// );
// const IconBook = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
//   </svg>
// );
// const IconLogOut = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//     <polyline points="16 17 21 12 16 7" />
//     <line x1="21" x2="9" y1="12" y2="12" />
//   </svg>
// );
// const IconEdit = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
//   </svg>
// );
// const IconUpload = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//     <polyline points="17 8 12 3 7 8" />
//     <line x1="12" x2="12" y1="3" y2="15" />
//   </svg>
// );

// export default function DashboardPage() {
//   const { user, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard', 'profile', 'academic'
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quote, setQuote] = useState("Welcome to your academic journey!");
//   const [isEditingQuote, setIsEditingQuote] = useState(false);

//   // --- 1. DATA FETCHING ---
//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//       return;
//     }

//     // Load local quote
//     const savedQuote = localStorage.getItem(`quote_${user._id}`);
//     if (savedQuote) setQuote(savedQuote);

//     fetchUserData();

//     // Auto-refresh ONLY on dashboard view to avoid form resets
//     let interval;
//     if (currentView === "dashboard") {
//       interval = setInterval(() => fetchUserData(true), 10000);
//     }
//     return () => clearInterval(interval);
//   }, [user, navigate, currentView]);

//   const fetchUserData = async (isBackground = false) => {
//     try {
//       if (!isBackground) setLoading(true);
//       const res = await fetch("http://localhost:5000/api/user/dashboard", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user._id }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setUserData(data);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (!isBackground) setLoading(false);
//     }
//   };

//   // --- 2. HANDLERS ---
//   const handleLogout = () => {
//     logoutUser();
//     navigate("/");
//   };

//   const saveQuote = () => {
//     localStorage.setItem(`quote_${user._id}`, quote);
//     setIsEditingQuote(false);
//   };

//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("userId", user._id);
//     formData.append("profilePhoto", file);
//     await fetch("http://localhost:5000/api/user/personal", {
//       method: "POST",
//       credentials: "include",
//       body: formData,
//     });
//     fetchUserData();
//   };

//   // --- 3. CALCULATIONS ---
//   const calculateCGPA = () => {
//     if (!userData?.academicDetails?.length) return "0.00";
//     let total = userData.academicDetails.reduce(
//       (acc, curr) => acc + (Number(curr.gpa) || 0),
//       0
//     );
//     return (total / userData.academicDetails.length).toFixed(2);
//   };

//   const backlogCount =
//     userData?.academicDetails?.reduce(
//       (acc, curr) => acc + (Number(curr.backlogs) || 0),
//       0
//     ) || 0;

//   if (loading && !userData)
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400">
//         Loading Portal...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
//       {/* === SIDEBAR (Fixed Left) === */}
//       <aside className="w-20 lg:w-64 bg-[#1E293B] text-slate-300 flex flex-col fixed h-full z-20 transition-all shadow-xl">
//         <div className="p-6 flex items-center gap-3 text-white mb-6">
//           <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">
//             P
//           </div>
//           <span className="font-bold text-lg hidden lg:block tracking-tight">
//             StudentPortal
//           </span>
//         </div>

//         <nav className="flex-1 px-4 space-y-2">
//           <
// Item
//             icon={<IconDashboard />}
//             label="Overview"
//             active={currentView === "dashboard"}
//             onClick={() => setCurrentView("dashboard")}
//           />
//           <SidebarItem
//             icon={<IconUser />}
//             label="My Profile"
//             active={currentView === "profile"}
//             onClick={() => setCurrentView("profile")}
//           />
//           <SidebarItem
//             icon={<IconBook />}
//             label="Academics"
//             active={currentView === "academic"}
//             onClick={() => setCurrentView("academic")}
//           />
//         </nav>

//         <div className="p-4 border-t border-slate-700">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
//           >
//             <IconLogOut />
//             <span className="hidden lg:block font-medium">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* === MAIN CONTENT (Scrollable Right) === */}
//       <main className="flex-1 ml-20 lg:ml-64 p-8 lg:p-10 transition-all">
//         {/* Top Header */}
//         <header className="flex justify-between items-center mb-10">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 capitalize">
//               {currentView}
//             </h1>
//             <p className="text-slate-500 text-sm">
//               Welcome back,{" "}
//               {userData?.personalDetails?.fullName?.split(" ")[0] ||
//                 user.username}
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Profile Pic Circle */}
//             <div className="relative group w-12 h-12">
//               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200">
//                 {userData?.personalDetails?.profilePhoto ? (
//                   <img
//                     src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl">
//                     👤
//                   </div>
//                 )}
//               </div>
//               {/* Mini Upload Overlay */}
//               <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
//                 <IconEdit className="text-white w-4 h-4" />
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
//               </label>
//             </div>
//           </div>
//         </header>

//         {/* === VIEW: DASHBOARD === */}
//         {currentView === "dashboard" && (
//           <div className="space-y-8 animate-fade-in">
//             {/* 1. Hero / Quote Section */}
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
//               <div className="relative z-10 max-w-2xl">
//                 <h2 className="text-3xl font-bold mb-2">
//                   Hello, {userData?.personalDetails?.fullName || "Student"}!
//                 </h2>
//                 {isEditingQuote ? (
//                   <div className="flex gap-2 mt-2">
//                     <input
//                       className="text-slate-800 px-3 py-1 rounded w-full"
//                       value={quote}
//                       onChange={(e) => setQuote(e.target.value)}
//                     />
//                     <button
//                       onClick={saveQuote}
//                       className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded font-bold"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 ) : (
//                   <p
//                     onClick={() => setIsEditingQuote(true)}
//                     className="opacity-90 italic cursor-pointer hover:underline decoration-white/50"
//                   >
//                     "{quote}" ✏️
//                   </p>
//                 )}
//               </div>
//               {/* Decorative Blob */}
//               <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
//             </div>

//             {/* 2. Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <StatCard
//                 title="CGPA"
//                 value={calculateCGPA()}
//                 color="bg-blue-50 text-blue-600 border-blue-100"
//               />
//               <StatCard
//                 title="Backlogs"
//                 value={backlogCount}
//                 color="bg-red-50 text-red-600 border-red-100"
//               />
//               <StatCard
//                 title="Current Sem"
//                 value={userData?.currentSemester}
//                 color="bg-green-50 text-green-600 border-green-100"
//               />
//             </div>

//             {/* 3. Promotion Status Banner */}
//             {userData?.promotionStatus === "pending" && (
//               <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <span className="text-2xl">⏳</span>
//                   <div>
//                     <p className="font-bold">Promotion Request Sent</p>
//                     <p className="text-sm opacity-80">
//                       Waiting for admin approval.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* 4. Quick Actions / Links */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//                 <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setCurrentView("academic")}
//                     className="flex-1 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition"
//                   >
//                     Academics
//                   </button>
//                   <button
//                     onClick={() => setCurrentView("profile")}
//                     className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-lg hover:bg-slate-50 transition"
//                   >
//                     Edit Profile
//                   </button>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//                 <h3 className="font-bold text-slate-800 mb-4">
//                   External Links
//                 </h3>
//                 <a
//                   href="https://vpmp.ac.in"
//                   target="_blank"
//                   className="block w-full text-center bg-indigo-50 text-indigo-600 py-3 rounded-lg hover:bg-indigo-100 font-medium"
//                 >
//                   Visit VPMP Official Website
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* === VIEW: PROFILE FORM === */}
//         {currentView === "profile" && (
//           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
//             <PersonalDetailsForm
//               userData={{ ...userData, _id: user._id }}
//               onComplete={() => {
//                 setCurrentView("dashboard");
//                 fetchUserData();
//               }}
//               onCancel={() => setCurrentView("dashboard")}
//             />
//           </div>
//         )}

//         {/* === VIEW: ACADEMIC FORM === */}
//         {currentView === "academic" && (
//           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
//             <AcademicDetailsForm
//               userData={{ ...userData, _id: user._id }}
//               onComplete={() => {
//                 setCurrentView("dashboard");
//                 fetchUserData();
//               }}
//               onCancel={() => setCurrentView("dashboard")}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function SidebarItem({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
//         active
//           ? "bg-indigo-600 text-white shadow-md"
//           : "text-slate-400 hover:bg-slate-800 hover:text-white"
//       }`}
//     >
//       {icon}
//       <span className="hidden lg:block font-medium">{label}</span>
//     </button>
//   );
// }

// function StatCard({ title, value, color }) {
//   return (
//     <div
//       className={`p-6 rounded-2xl border ${color} shadow-sm flex flex-col items-center justify-center text-center`}
//     >
//       <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
//         {title}
//       </p>
//       <h3 className="text-4xl font-extrabold">{value}</h3>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate } from "react-router-dom";
// import PersonalDetailsForm from "../components/PersonalDetailsForm";
// import AcademicDetailsForm from "../components/AcademicDetailsForm";
// import {
//   LayoutDashboard,
//   User,
//   BookOpen,
//   LogOut,
//   Edit2,
//   Quote,
//   GraduationCap,
//   AlertCircle,
//   CheckCircle2,
//   Lock,
//   Unlock,
// } from "lucide-react";

// export default function DashboardPage() {
//   const { user, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   const [currentView, setCurrentView] = useState("dashboard");
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quote, setQuote] = useState("Knowledge is power.");
//   const [isEditingQuote, setIsEditingQuote] = useState(false);

//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [profileForm, setProfileForm] = useState({});
//   const [activeSemester, setActiveSemester] = useState(null);
//   const [semForm, setSemForm] = useState({
//     gpa: "",
//     backlogs: "",
//     remarks: "",
//   });

//   // --- DATA FETCHING ---
//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//       return;
//     }

//     const savedQuote = localStorage.getItem(`quote_${user._id}`);
//     if (savedQuote) setQuote(savedQuote);

//     fetchUserData();

//     let interval;
//     if (currentView === "dashboard") {
//       interval = setInterval(() => fetchUserData(true), 10000);
//     }
//     return () => clearInterval(interval);
//   }, [user, navigate, currentView]);

//   const fetchUserData = async (isBackground = false) => {
//     try {
//       if (!isBackground) setLoading(true);
//       const res = await fetch("http://localhost:5000/api/user/dashboard", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user._id }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setUserData(data);
//         setProfileForm(data.personalDetails || {});
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (!isBackground) setLoading(false);
//     }
//   };

//   // --- HANDLERS ---
//   const handleLogout = () => {
//     logoutUser();
//     navigate("/");
//   };

//   const saveQuote = () => {
//     localStorage.setItem(`quote_${user._id}`, quote);
//     setIsEditingQuote(false);
//   };

//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("userId", user._id);
//     formData.append("profilePhoto", file);
//     await fetch("http://localhost:5000/api/user/personal", {
//       method: "POST",
//       credentials: "include",
//       body: formData,
//     });
//     fetchUserData();
//   };

//   const handleProfileUpdate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("userId", user._id);
//       Object.keys(profileForm).forEach((key) =>
//         formData.append(key, profileForm[key])
//       );
//       await fetch("http://localhost:5000/api/user/personal", {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });
//       setIsEditingProfile(false);
//       fetchUserData();
//     } catch (e) {
//       alert("Update failed");
//     }
//   };

//   const handleSemesterSave = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("userId", user._id);
//       formData.append("semester", activeSemester);
//       formData.append("gpa", semForm.gpa);
//       formData.append("backlogs", semForm.backlogs);
//       await fetch("http://localhost:5000/api/user/academic", {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });
//       setActiveSemester(null);
//       fetchUserData();
//     } catch (e) {
//       alert("Failed to save");
//     }
//   };

//   if (loading && !userData)
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-sans">
//         Loading Portal...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
//       {/* === SIDEBAR (Modern Dark) === */}
//       <aside className="w-20 lg:w-72 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
//         <div className="p-6 flex items-center gap-3 text-white mb-6">
//           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
//             P
//           </div>
//           <span className="font-bold text-xl hidden lg:block tracking-tight">
//             StudentPortal
//           </span>
//         </div>

//         <nav className="flex-1 px-4 space-y-2">
//           <SidebarItem
//             icon={<LayoutDashboard size={20} />}
//             label="Overview"
//             active={currentView === "dashboard"}
//             onClick={() => setCurrentView("dashboard")}
//           />
//           <SidebarItem
//             icon={<User size={20} />}
//             label="My Profile"
//             active={currentView === "profile"}
//             onClick={() => setCurrentView("profile")}
//           />
//           <SidebarItem
//             icon={<BookOpen size={20} />}
//             label="Academics"
//             active={currentView === "academic"}
//             onClick={() => setCurrentView("academic")}
//           />
//         </nav>

//         <div className="p-4 border-t border-slate-800">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group"
//           >
//             <LogOut size={20} className="group-hover:text-red-400" />
//             <span className="hidden lg:block font-medium">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* === MAIN CONTENT === */}
//       <main className="flex-1 ml-20 lg:ml-72 p-8 lg:p-12 transition-all">
//         {/* === VIEW: DASHBOARD === */}
//         {currentView === "dashboard" && (
//           <div className="space-y-8 animate-fade-in">
//             {/* Header Banner */}
//             <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative z-10">
//                 <div className="mb-6 lg:mb-0">
//                   <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">
//                     Welcome back,{" "}
//                     {userData?.personalDetails?.fullName?.split(" ")[0] ||
//                       user.username}
//                     !
//                   </h1>
//                   {isEditingQuote ? (
//                     <div className="flex gap-2 mt-4">
//                       <input
//                         className="text-slate-800 px-4 py-2 rounded-xl w-full max-w-md outline-none focus:ring-2 focus:ring-white/50"
//                         value={quote}
//                         onChange={(e) => setQuote(e.target.value)}
//                       />
//                       <button
//                         onClick={saveQuote}
//                         className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-bold transition-colors"
//                       >
//                         Save
//                       </button>
//                     </div>
//                   ) : (
//                     <div
//                       onClick={() => setIsEditingQuote(true)}
//                       className="flex items-center gap-2 opacity-90 cursor-pointer hover:opacity-100 transition-opacity group"
//                     >
//                       <Quote
//                         size={18}
//                         className="fill-white/80 group-hover:fill-white"
//                       />
//                       <p className="italic text-lg font-medium">"{quote}"</p>
//                       <Edit2
//                         size={16}
//                         className="opacity-0 group-hover:opacity-100 transition-opacity"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Profile Section in Banner */}
//                 <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
//                   <div className="text-right hidden md:block">
//                     <p className="font-bold text-lg">
//                       {userData?.personalDetails?.fullName || user.username}
//                     </p>
//                     <p className="text-sm opacity-80">{user.enrollmentNo}</p>
//                   </div>
//                   <div className="relative group w-16 h-16">
//                     <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md bg-slate-200/20">
//                       {userData?.personalDetails?.profilePhoto ? (
//                         <img
//                           src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
//                           className="w-full h-full object-cover"
//                           alt="Profile"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl">
//                           <User size={28} />
//                         </div>
//                       )}
//                     </div>
//                     <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
//                       <Edit2 className="text-white w-6 h-6" />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handlePhotoUpload}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               {/* Decorative Blob */}
//               <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
//             </div>

//             {/* Promotion Alert */}
//             {userData?.promotionStatus === "pending" && (
//               <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-2xl shadow-sm flex items-center gap-4">
//                 <div className="p-3 bg-amber-100 rounded-full text-amber-600">
//                   <AlertCircle size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-amber-800">
//                     Promotion Pending
//                   </h3>
//                   <p className="text-amber-700">
//                     Your request for the next semester is under review by the
//                     administration.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Academic Grid */}
//             <div>
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold flex items-center gap-3">
//                   <GraduationCap className="text-indigo-600" size={28} />
//                   Academic Journey
//                 </h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
//                   const semData = userData.academicDetails.find(
//                     (d) => d.semester === sem
//                   );
//                   const isCompleted = semData?.isCompleted;
//                   const isUnlocked =
//                     sem === 1 ||
//                     userData.academicDetails.some(
//                       (d) => d.semester === sem - 1 && d.isCompleted
//                     );

//                   return (
//                     <button
//                       key={sem}
//                       disabled={!isUnlocked}
//                       onClick={() => setActiveSemester(sem)}
//                       className={`relative p-6 rounded-2xl transition-all text-left group overflow-hidden ${
//                         isCompleted
//                           ? "bg-white border-2 border-transparent hover:border-green-500 shadow-sm"
//                           : isUnlocked
//                           ? "bg-white border-2 border-transparent hover:border-indigo-500 shadow-sm"
//                           : "bg-slate-200 border-2 border-transparent opacity-70 cursor-not-allowed"
//                       }`}
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">
//                             Semester
//                           </p>
//                           <h3 className="text-3xl font-extrabold text-slate-800">
//                             {sem}
//                           </h3>
//                         </div>
//                         <div
//                           className={`p-2 rounded-xl ${
//                             isCompleted
//                               ? "bg-green-100 text-green-600"
//                               : isUnlocked
//                               ? "bg-indigo-100 text-indigo-600"
//                               : "bg-slate-300 text-slate-500"
//                           }`}
//                         >
//                           {isCompleted ? (
//                             <CheckCircle2 size={24} />
//                           ) : isUnlocked ? (
//                             <Unlock size={24} />
//                           ) : (
//                             <Lock size={24} />
//                           )}
//                         </div>
//                       </div>

//                       {isCompleted ? (
//                         <div className="space-y-3">
//                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                             <span className="text-sm font-medium text-slate-600">
//                               GPA
//                             </span>
//                             <span className="font-bold text-slate-800">
//                               {semData.gpa}
//                             </span>
//                           </div>
//                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                             <span className="text-sm font-medium text-slate-600">
//                               Backlogs
//                             </span>
//                             <span
//                               className={`font-bold ${
//                                 semData.backlogs > 0
//                                   ? "text-red-500"
//                                   : "text-green-500"
//                               }`}
//                             >
//                               {semData.backlogs}
//                             </span>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="h-24 flex items-center justify-center text-slate-400 font-medium italic">
//                           {isUnlocked ? "Tap to update details" : "Locked"}
//                         </div>
//                       )}

//                       {/* Hover Effect */}
//                       <div
//                         className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
//                           isCompleted ? "bg-green-500" : "bg-indigo-500"
//                         }`}
//                       ></div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Manual Request Button */}
//             <div className="text-center pt-8 border-t border-slate-200">
//               <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 mx-auto group">
//                 <span>Request Promotion Manually</span>
//                 <Edit2
//                   size={16}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* === VIEW: PROFILE FORM === */}
//         {currentView === "profile" && (
//           <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-4xl mx-auto animate-fade-in">
//             <PersonalDetailsForm
//               userData={{ ...userData, _id: user._id }}
//               onComplete={() => {
//                 setCurrentView("dashboard");
//                 fetchUserData();
//               }}
//               onCancel={() => setCurrentView("dashboard")}
//             />
//           </div>
//         )}

//         {/* === VIEW: ACADEMIC FORM === */}
//         {currentView === "academic" && (
//           <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-4xl mx-auto animate-fade-in">
//             <AcademicDetailsForm
//               userData={{ ...userData, _id: user._id }}
//               onComplete={() => {
//                 setCurrentView("dashboard");
//                 fetchUserData();
//               }}
//             />
//           </div>
//         )}
//       </main>

//       {/* === MODAL: SEMESTER FORM === */}
//       {activeSemester && (
//         <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-scale-in">
//             <button
//               onClick={() => setActiveSemester(null)}
//               className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-full"
//             >
//               <LogOut size={20} className="rotate-45" />
//             </button>

//             <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
//               Update Semester {activeSemester}
//             </h3>

//             <form onSubmit={handleSemesterSave} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
//                   Grade Point Average (GPA)
//                 </label>
//                 <input
//                   className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
//                   type="number"
//                   step="0.01"
//                   max="10"
//                   required
//                   value={semForm.gpa}
//                   onChange={(e) =>
//                     setSemForm({ ...semForm, gpa: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
//                   Number of Backlogs
//                 </label>
//                 <input
//                   className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
//                   type="number"
//                   required
//                   value={semForm.backlogs}
//                   onChange={(e) =>
//                     setSemForm({ ...semForm, backlogs: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
//                   Remarks (Optional)
//                 </label>
//                 <textarea
//                   className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium resize-none"
//                   rows="3"
//                   value={semForm.remarks}
//                   onChange={(e) =>
//                     setSemForm({ ...semForm, remarks: e.target.value })
//                   }
//                 ></textarea>
//               </div>

//               <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
//                 Save Details
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function SidebarItem({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all group ${
//         active
//           ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
//           : "text-slate-400 hover:text-white hover:bg-slate-800"
//       }`}
//     >
//       <div
//         className={`${
//           active ? "text-white" : "text-slate-500 group-hover:text-white"
//         }`}
//       >
//         {icon}
//       </div>
//       <span className="hidden lg:block font-medium tracking-wide text-sm">
//         {label}
//       </span>
//     </button>
//   );
// }

// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/useAuth";
// import { useNavigate } from "react-router-dom";
// import PersonalDetailsForm from "../components/PersonalDetailsForm";
// import AcademicDetailsForm from "../components/AcademicDetailsForm";
// import Sidebar from "../../components/student/dashboard/Sidebar";
// import DashboardOverview from "../../components/student/dashboard/DashboardOverview";

// export default function DashboardPage() {
//   const { user, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   const [currentView, setCurrentView] = useState("dashboard");
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // --- DATA FETCHING ---
//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//       return;
//     }
//     fetchUserData();

//     // Polling only on overview
//     let interval;
//     if (currentView === "dashboard") {
//       interval = setInterval(() => fetchUserData(true), 10000);
//     }
//     return () => clearInterval(interval);
//   }, [user, navigate, currentView]);

//   const fetchUserData = async (isBackground = false) => {
//     try {
//       if (!isBackground) setLoading(true);
//       const res = await fetch("http://localhost:5000/api/user/dashboard", {
//         method: "GET", // Changed to GET as per standard
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setUserData(data);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (!isBackground) setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logoutUser();
//     navigate("/");
//   };

//   if (loading && !userData)
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-sans">
//         Loading Portal...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
//       {/* === MODULAR SIDEBAR === */}
//       <Sidebar
//         currentView={currentView}
//         setCurrentView={setCurrentView}
//         onLogout={handleLogout}
//       />

//       {/* === MAIN CONTENT === */}
//       <main className="flex-1 ml-20 lg:ml-72 p-8 lg:p-12 transition-all">
//         {/* === VIEW: DASHBOARD (OVERVIEW) === */}
//         {currentView === "dashboard" && (
//           <DashboardOverview
//             user={user}
//             userData={userData}
//             fetchUserData={fetchUserData}
//           />
//         )}

//         {/* === VIEW: PROFILE FORM === */}
//         {currentView === "profile" && (
//           <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-4xl mx-auto animate-fade-in">
//             <PersonalDetailsForm
//               userData={{ ...userData, _id: user._id }}
//               onComplete={() => {
//                 setCurrentView("dashboard");
//                 fetchUserData();
//               }}
//               onCancel={() => setCurrentView("dashboard")}
//             />
//           </div>
//         )}

//         {/* === VIEW: ACADEMIC FORM === */}
//         {currentView === "academic" && (
//           <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-4xl mx-auto animate-fade-in">
//             <AcademicDetailsForm
//               userData={{ ...userData, _id: user._id }}
//               onComplete={() => {
//                 setCurrentView("dashboard");
//                 fetchUserData();
//               }}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

import PersonalDetailsForm from "../../components/student/forms/PersonalDetailsForm";
import AcademicDetailsForm from "../../components/student/forms/AcademicDetailsForm";
import Sidebar from "../../components/student/dashboard/Sidebar";
import DashboardOverview from "../../components/student/dashboard/DashboardOverview";

export default function StudentDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchUserData();

    let interval;
    if (currentView === "dashboard") {
      interval = setInterval(() => fetchUserData(true), 10000);
    }
    return () => clearInterval(interval);
  }, [user, navigate, currentView]);

  const fetchUserData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await fetch("http://localhost:5000/api/user/dashboard", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (loading && !userData)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading Portal...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-20 lg:ml-72 p-8 lg:p-12 transition-all">
        {currentView === "dashboard" && (
          <DashboardOverview
            user={user}
            userData={userData}
            fetchUserData={fetchUserData}
            setView={setCurrentView} // Pass setter to allow navigation from Banner
          />
        )}

        {currentView === "profile" && (
          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-4xl mx-auto animate-fade-in">
            <PersonalDetailsForm
              userData={{ ...userData, _id: user._id }}
              onComplete={() => {
                setCurrentView("dashboard");
                fetchUserData();
              }}
              onCancel={() => setCurrentView("dashboard")}
            />
          </div>
        )}

        {currentView === "academic" && (
          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-4xl mx-auto animate-fade-in">
            <AcademicDetailsForm
              userData={{ ...userData, _id: user._id }}
              onComplete={() => {
                setCurrentView("dashboard");
                fetchUserData();
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
