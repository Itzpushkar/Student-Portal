// import { useState } from "react";
// import {
//   Quote,
//   Edit2,
//   User,
//   AlertCircle,
//   GraduationCap,
//   CheckCircle2,
//   Unlock,
//   Lock,
//   LogOut,
// } from "lucide-react";

// export default function DashboardOverview({ user, userData, fetchUserData }) {
//   const [quote, setQuote] = useState(
//     localStorage.getItem(`quote_${user._id}`) || "Knowledge is power."
//   );
//   const [isEditingQuote, setIsEditingQuote] = useState(false);
//   const [activeSemester, setActiveSemester] = useState(null);
//   const [semForm, setSemForm] = useState({
//     gpa: "",
//     backlogs: "",
//     remarks: "",
//   });

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

//   const handleSemesterSave = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("userId", user._id);
//       formData.append("semester", activeSemester);
//       formData.append("gpa", semForm.gpa);
//       formData.append("backlogs", semForm.backlogs);
//       // Note: Remarks/Images support would go here if form was expanded
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

//   return (
//     <div className="space-y-8 animate-fade-in">
//       {/* Header Banner */}
//       <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative z-10">
//           <div className="mb-6 lg:mb-0">
//             <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">
//               Welcome back,{" "}
//               {userData?.personalDetails?.fullName?.split(" ")[0] ||
//                 user.username}
//               !
//             </h1>
//             {isEditingQuote ? (
//               <div className="flex gap-2 mt-4">
//                 <input
//                   className="text-slate-800 px-4 py-2 rounded-xl w-full max-w-md outline-none focus:ring-2 focus:ring-white/50"
//                   value={quote}
//                   onChange={(e) => setQuote(e.target.value)}
//                 />
//                 <button
//                   onClick={saveQuote}
//                   className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-bold transition-colors"
//                 >
//                   Save
//                 </button>
//               </div>
//             ) : (
//               <div
//                 onClick={() => setIsEditingQuote(true)}
//                 className="flex items-center gap-2 opacity-90 cursor-pointer hover:opacity-100 transition-opacity group"
//               >
//                 <Quote
//                   size={18}
//                   className="fill-white/80 group-hover:fill-white"
//                 />
//                 <p className="italic text-lg font-medium">"{quote}"</p>
//                 <Edit2
//                   size={16}
//                   className="opacity-0 group-hover:opacity-100 transition-opacity"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Profile Section in Banner */}
//           <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
//             <div className="text-right hidden md:block">
//               <p className="font-bold text-lg">
//                 {userData?.personalDetails?.fullName || user.username}
//               </p>
//               <p className="text-sm opacity-80">{user.enrollmentNo}</p>
//             </div>
//             <div className="relative group w-16 h-16">
//               <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md bg-slate-200/20">
//                 {userData?.personalDetails?.profilePhoto ? (
//                   <img
//                     src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
//                     className="w-full h-full object-cover"
//                     alt="Profile"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl">
//                     <User size={28} />
//                   </div>
//                 )}
//               </div>
//               <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
//                 <Edit2 className="text-white w-6 h-6" />
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
//               </label>
//             </div>
//           </div>
//         </div>
//         <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Promotion Alert */}
//       {userData?.promotionStatus === "pending" && (
//         <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-2xl shadow-sm flex items-center gap-4">
//           <div className="p-3 bg-amber-100 rounded-full text-amber-600">
//             <AlertCircle size={24} />
//           </div>
//           <div>
//             <h3 className="text-lg font-bold text-amber-800">
//               Promotion Pending
//             </h3>
//             <p className="text-amber-700">
//               Your request for the next semester is under review.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Academic Grid */}
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold flex items-center gap-3">
//             <GraduationCap className="text-indigo-600" size={28} /> Academic
//             Journey
//           </h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
//             const semData = userData.academicDetails.find(
//               (d) => d.semester === sem
//             );
//             const isCompleted = semData?.isCompleted;
//             const isUnlocked =
//               sem === 1 ||
//               userData.academicDetails.some(
//                 (d) => d.semester === sem - 1 && d.isCompleted
//               );

//             return (
//               <button
//                 key={sem}
//                 disabled={!isUnlocked}
//                 onClick={() => setActiveSemester(sem)}
//                 className={`relative p-6 rounded-2xl transition-all text-left group overflow-hidden ${
//                   isCompleted
//                     ? "bg-white border-2 border-transparent hover:border-green-500 shadow-sm"
//                     : isUnlocked
//                     ? "bg-white border-2 border-transparent hover:border-indigo-500 shadow-sm"
//                     : "bg-slate-200 border-2 border-transparent opacity-70 cursor-not-allowed"
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">
//                       Semester
//                     </p>
//                     <h3 className="text-3xl font-extrabold text-slate-800">
//                       {sem}
//                     </h3>
//                   </div>
//                   <div
//                     className={`p-2 rounded-xl ${
//                       isCompleted
//                         ? "bg-green-100 text-green-600"
//                         : isUnlocked
//                         ? "bg-indigo-100 text-indigo-600"
//                         : "bg-slate-300 text-slate-500"
//                     }`}
//                   >
//                     {isCompleted ? (
//                       <CheckCircle2 size={24} />
//                     ) : isUnlocked ? (
//                       <Unlock size={24} />
//                     ) : (
//                       <Lock size={24} />
//                     )}
//                   </div>
//                 </div>
//                 {isCompleted ? (
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                       <span className="text-sm font-medium text-slate-600">
//                         GPA
//                       </span>
//                       <span className="font-bold text-slate-800">
//                         {semData.gpa}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                       <span className="text-sm font-medium text-slate-600">
//                         Backlogs
//                       </span>
//                       <span
//                         className={`font-bold ${
//                           semData.backlogs > 0
//                             ? "text-red-500"
//                             : "text-green-500"
//                         }`}
//                       >
//                         {semData.backlogs}
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-24 flex items-center justify-center text-slate-400 font-medium italic">
//                     {isUnlocked ? "Tap to update details" : "Locked"}
//                   </div>
//                 )}
//                 <div
//                   className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
//                     isCompleted ? "bg-green-500" : "bg-indigo-500"
//                   }`}
//                 ></div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Manual Request Button */}
//       <div className="text-center pt-8 border-t border-slate-200">
//         <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 mx-auto group">
//           <span>Request Promotion Manually</span>
//           <Edit2
//             size={16}
//             className="group-hover:translate-x-1 transition-transform"
//           />
//         </button>
//       </div>

//       {/* Modal for Semester Update */}
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

import { useState } from "react";
import {
  Quote,
  Edit2,
  User,
  AlertCircle,
  GraduationCap,
  CheckCircle2,
  Unlock,
  Lock,
  LogOut,
  Upload,
} from "lucide-react";

export default function DashboardOverview({ user, userData, fetchUserData }) {
  const [quote, setQuote] = useState(
    localStorage.getItem(`quote_${user._id}`) || "Knowledge is power."
  );
  const [isEditingQuote, setIsEditingQuote] = useState(false);

  const [activeSemester, setActiveSemester] = useState(null);
  const [semForm, setSemForm] = useState({
    gpa: "",
    backlogs: "",
    remarks: "",
  });
  const [resultImage, setResultImage] = useState(null);

  const saveQuote = () => {
    localStorage.setItem(`quote_${user._id}`, quote);
    setIsEditingQuote(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("profilePhoto", file);
    await fetch("http://localhost:5000/api/user/personal", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    fetchUserData();
  };

  const handleSemesterSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("semester", activeSemester);
      formData.append("gpa", semForm.gpa);
      formData.append("backlogs", semForm.backlogs);
      formData.append("remarks", semForm.remarks);
      if (resultImage) formData.append("marksheets", resultImage);

      await fetch("http://localhost:5000/api/user/academic", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setActiveSemester(null);
      fetchUserData();
      alert("Academic Details Saved & Email Sent!");
    } catch (e) {
      alert("Failed to save");
    }
  };

  const handleRequestPromotion = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/request-promotion",
        { method: "POST", credentials: "include" }
      );
      if (res.ok) {
        alert("Promotion Request Sent to Admin");
        fetchUserData();
      } else {
        alert("Request Already Pending");
      }
    } catch (e) {
      alert("Error sending request");
    }
  };

  const handleSemesterClick = (sem, isUnlocked) => {
    // FIX: Strict check for Personal Details completion
    if (!userData.isPersonalDetailsCompleted) {
      alert("Please fill your Personal Details first!");
      return;
    }

    // Only open if unlocked or completed
    if (isUnlocked) {
      const existingData = userData.academicDetails.find(
        (d) => d.semester === sem
      );
      setSemForm({
        gpa: existingData?.gpa || "",
        backlogs: existingData?.backlogs || "",
        remarks: existingData?.remarks || "",
      });
      setActiveSemester(sem);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative z-10">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">
              Welcome back,{" "}
              {userData?.personalDetails?.fullName?.split(" ")[0] ||
                user.username}
              !
            </h1>
            {isEditingQuote ? (
              <div className="flex gap-2 mt-4">
                <input
                  className="text-slate-800 px-4 py-2 rounded-xl w-full max-w-md outline-none"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
                <button
                  onClick={saveQuote}
                  className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingQuote(true)}
                className="flex items-center gap-2 opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
              >
                <Quote size={18} className="fill-white/80" />
                <p className="italic text-lg font-medium">"{quote}"</p>
                <Edit2 size={16} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="text-right hidden md:block">
              <p className="font-bold text-lg">
                {userData?.personalDetails?.fullName || user.username}
              </p>
              <p className="text-sm opacity-80">{user.enrollmentNo}</p>
            </div>
            <div className="relative group w-16 h-16">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md bg-slate-200/20">
                {userData?.personalDetails?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl">
                    <User size={28} />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                <Edit2 className="text-white w-6 h-6" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Alert */}
      {userData?.promotionStatus === "pending" && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800">
              Promotion Pending
            </h3>
            <p className="text-amber-700">Your request is under review.</p>
          </div>
        </div>
      )}

      {/* Academic Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <GraduationCap className="text-indigo-600" size={28} /> Academic
            Journey
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const semData = userData.academicDetails.find(
              (d) => d.semester === sem
            );
            const isCompleted = semData?.isCompleted;
            const isUnlocked = sem === 1 || userData.currentSemester >= sem;

            return (
              <button
                key={sem}
                // VISUAL DISABLE: Only look disabled if locked. Click logic handled in handler.
                className={`relative p-6 rounded-2xl transition-all text-left group overflow-hidden ${
                  isCompleted
                    ? "bg-white border-2 border-transparent hover:border-green-500 shadow-sm"
                    : isUnlocked
                    ? "bg-white border-2 border-transparent hover:border-indigo-500 shadow-sm"
                    : "bg-slate-200 border-2 border-transparent opacity-70 cursor-not-allowed"
                }`}
                onClick={() => handleSemesterClick(sem, isUnlocked)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Semester
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {sem}
                    </h3>
                  </div>
                  <div
                    className={`p-2 rounded-xl ${
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : isUnlocked
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-300 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} />
                    ) : isUnlocked ? (
                      <Unlock size={24} />
                    ) : (
                      <Lock size={24} />
                    )}
                  </div>
                </div>
                {isCompleted ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-medium text-slate-600">
                        GPA
                      </span>
                      <span className="font-bold text-slate-800">
                        {semData.gpa}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-medium text-slate-600">
                        Backlogs
                      </span>
                      <span
                        className={`font-bold ${
                          semData.backlogs > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {semData.backlogs}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center text-slate-400 font-medium italic">
                    {isUnlocked ? "Tap to update details" : "Locked"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Request */}
      <div className="text-center pt-8 border-t border-slate-200">
        <button
          onClick={handleRequestPromotion}
          disabled={userData.promotionStatus === "pending"}
          className={`text-sm font-bold transition-colors flex items-center gap-2 mx-auto px-6 py-3 rounded-full ${
            userData.promotionStatus === "pending"
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
          }`}
        >
          <span>
            {userData.promotionStatus === "pending"
              ? "Request Pending..."
              : "Request Promotion to Next Semester"}
          </span>
          <Edit2 size={16} />
        </button>
      </div>

      {/* Modal */}
      {activeSemester && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setActiveSemester(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <LogOut size={20} className="rotate-45" />
            </button>
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              Update Semester {activeSemester}
            </h3>
            <form onSubmit={handleSemesterSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
                  Grade Point Average (GPA)
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold"
                  type="number"
                  step="0.01"
                  max="10"
                  required
                  value={semForm.gpa}
                  onChange={(e) =>
                    setSemForm({ ...semForm, gpa: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
                  Backlogs
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold"
                  type="number"
                  required
                  value={semForm.backlogs}
                  onChange={(e) =>
                    setSemForm({ ...semForm, backlogs: e.target.value })
                  }
                />
              </div>

              {/* Added Result Image Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
                  Result Image
                </label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setResultImage(e.target.files[0])}
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload size={24} />
                    <span className="text-sm font-medium">
                      {resultImage
                        ? resultImage.name
                        : "Tap to upload marksheet"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">
                  Remarks
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium resize-none"
                  rows="3"
                  value={semForm.remarks}
                  onChange={(e) =>
                    setSemForm({ ...semForm, remarks: e.target.value })
                  }
                ></textarea>
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg">
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
