import { useState, useMemo } from "react";
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
  Mail,
  Hash,
  BookOpen,
} from "lucide-react";
import WarningModal from "../../common/WarningModal"; // Import Modal

export default function DashboardOverview({
  user,
  userData,
  fetchUserData,
  setView,
}) {
  const [quote, setQuote] = useState(
    localStorage.getItem(`quote_${user._id}`) || "Knowledge is power."
  );
  const [isEditingQuote, setIsEditingQuote] = useState(false);

  // Modal State
  const [activeSemester, setActiveSemester] = useState(null);
  const [semForm, setSemForm] = useState({
    gpa: "",
    backlogs: "",
    remarks: "",
  });
  const [resultImage, setResultImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isHoveringSem, setIsHoveringSem] = useState(null);

  // Warning State
  const [warning, setWarning] = useState({ show: false, title: "", msg: "" });

  const stats = useMemo(() => {
    if (!userData?.academicDetails?.length)
      return { cgpa: "0.00", totalBacklogs: 0 };

    const totalBacklogs = userData.academicDetails.reduce(
      (sum, sem) => sum + (parseInt(sem.backlogs) || 0),
      0
    );
    const totalGpa = userData.academicDetails.reduce(
      (sum, sem) => sum + (parseFloat(sem.gpa) || 0),
      0
    );
    const cgpa = (totalGpa / userData.academicDetails.length).toFixed(2);

    return { cgpa, totalBacklogs };
  }, [userData]);

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
    fetchUserData(true);
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

      if (resultImage) {
        formData.append("marksheets", resultImage);
      }

      const res = await fetch("http://localhost:5000/api/user/academic", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        setActiveSemester(null);
        fetchUserData();
        alert("Details Saved & Report Emailed!");
      } else {
        alert("Failed to save.");
      }
    } catch (e) {
      alert("Error saving details");
    }
  };

  const handleRequestPromotion = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/request-promotion",
        { method: "POST", credentials: "include" }
      );
      if (res.ok) {
        alert("Promotion Request Sent to Sub-Admin");
        fetchUserData();
      } else {
        setWarning({
          show: true,
          title: "Request Pending",
          msg: "You already have a pending promotion request.",
        });
      }
    } catch (e) {
      alert("Error sending request");
    }
  };

  const handleSemesterClick = (sem, isUnlocked) => {
    // 1. Check Personal Details
    if (!userData.isPersonalDetailsCompleted) {
      setWarning({
        show: true,
        title: "Incomplete Profile",
        msg: "Please fill out your Personal Details completely before accessing academic records.",
      });
      return;
    }

    // 2. Check Pending Promotion
    if (userData.promotionStatus === "pending") {
      setWarning({
        show: true,
        title: "Action Locked",
        msg: "Your promotion request is currently pending approval. You cannot edit details at this time.",
      });
      return;
    }

    if (isUnlocked) {
      const existingData = userData.academicDetails.find(
        (d) => d.semester === sem
      );
      setSemForm({
        gpa: existingData?.gpa || "",
        backlogs: existingData?.backlogs || "",
        remarks: existingData?.remarks || "",
      });
      setExistingImage(existingData?.marksheetImages?.[0] || null);
      setResultImage(null);
      setActiveSemester(sem);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. HERO BANNER */}
      <div className="relative mt-10">
        <div className="absolute -top-8 left-2 z-10">
          {isEditingQuote ? (
            <div className="flex gap-2 items-center bg-white p-1 rounded-lg shadow-sm border border-slate-200">
              <input
                className="text-sm text-slate-600 outline-none w-64 bg-transparent px-2"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                autoFocus
              />
              <button
                onClick={saveQuote}
                className="text-xs bg-indigo-600 text-white px-2 py-1 rounded font-bold hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingQuote(true)}
              className="flex items-center gap-2 cursor-pointer group text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Quote size={14} className="fill-current rotate-180" />
              <p className="italic text-sm font-medium">"{quote}"</p>
              <Edit2
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex items-center min-h-[180px]">
          <div className="flex flex-col md:flex-row items-center gap-8 z-10 w-full">
            <div className="relative group flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white/10 flex items-center justify-center">
                {userData?.personalDetails?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <User size={48} className="text-white/50" />
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Edit2 className="text-white drop-shadow-md" size={24} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                {userData?.personalDetails?.fullName || user.username}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-indigo-100 font-medium text-sm md:text-base">
                <div
                  className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors"
                  onClick={() => setView("profile")}
                >
                  <span>
                    {userData?.personalDetails?.branch || "Branch N/A"}
                  </span>
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
                <span className="opacity-50 text-lg font-light hidden md:inline">
                  |
                </span>
                <div
                  className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors"
                  onClick={() => setView("profile")}
                >
                  <span>{user.enrollmentNo}</span>
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
                <span className="opacity-50 text-lg font-light hidden md:inline">
                  |
                </span>
                <div
                  className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors"
                  onClick={() => setView("profile")}
                >
                  <span className="truncate max-w-[200px]">
                    {userData?.email || user.email}
                  </span>
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 ml-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[100px] shadow-lg">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">
                  CGPA
                </p>
                <p className="text-2xl font-black text-white">{stats.cgpa}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[100px] shadow-lg">
                <p className="text-xs font-bold text-red-200 uppercase tracking-wider mb-1">
                  Backlogs
                </p>
                <p className="text-2xl font-black text-white">
                  {stats.totalBacklogs}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/2 blur-3xl pointer-events-none"></div>
        </div>
      </div>

      {/* 2. PROMOTION ALERT */}
      {userData?.promotionStatus === "pending" && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800">
              Promotion Pending
            </h3>
            <p className="text-amber-700">
              Your request is being reviewed by the Sub-Admin.
            </p>
          </div>
        </div>
      )}

      {/* 3. ACADEMIC GRID */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
            <GraduationCap className="text-indigo-600" size={28} /> Academic
            Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((sem) => {
            const semData = userData.academicDetails.find(
              (d) => d.semester === sem
            );
            const isCompleted = semData?.isCompleted;
            const isUnlocked = sem === 1 || userData.currentSemester >= sem;

            const isNextSemester = sem === userData.currentSemester + 1;
            const currentSemData = userData.academicDetails.find(
              (d) => d.semester === userData.currentSemester
            );
            const isCurrentSemFilled = currentSemData?.isCompleted;
            const canRequestPromotion =
              isNextSemester &&
              isCurrentSemFilled &&
              userData.promotionStatus !== "pending";

            return (
              <div
                key={sem}
                className="relative group"
                onMouseEnter={() => setIsHoveringSem(sem)}
                onMouseLeave={() => setIsHoveringSem(null)}
              >
                <button
                  disabled={!isUnlocked && !isNextSemester}
                  onClick={() => handleSemesterClick(sem, isUnlocked)}
                  className={`w-full relative p-6 rounded-2xl transition-all text-left overflow-hidden h-40 flex flex-col justify-between ${
                    isCompleted
                      ? "bg-white border-2 border-transparent hover:border-green-500 shadow-sm"
                      : isUnlocked
                      ? "bg-white border-2 border-transparent hover:border-indigo-500 shadow-sm"
                      : "bg-slate-100 border-2 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Semester
                      </p>
                      <h3 className="text-3xl font-extrabold text-slate-700">
                        {sem}
                      </h3>
                    </div>
                    <div
                      className={`p-2 rounded-xl ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : isUnlocked
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-slate-300 text-slate-400"
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
                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block">
                          GPA
                        </span>
                        <span className="font-bold text-slate-700">
                          {semData.gpa}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">
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
                    <div className="text-slate-400 text-sm font-medium italic">
                      {isUnlocked ? "Tap to fill details" : "Locked"}
                    </div>
                  )}
                </button>

                {canRequestPromotion && isHoveringSem === sem && (
                  <div className="absolute inset-0 bg-indigo-900/95 rounded-2xl flex flex-col items-center justify-center text-white backdrop-blur-sm animate-fade-in z-20 cursor-default">
                    <p className="font-bold mb-3 text-center px-4 text-sm">
                      Previous Semester Completed!
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestPromotion();
                      }}
                      className="bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
                    >
                      Request Promotion
                    </button>
                  </div>
                )}

                {isNextSemester && userData.promotionStatus === "pending" && (
                  <div className="absolute inset-0 bg-amber-50/80 rounded-2xl border-2 border-dashed border-amber-300 flex items-center justify-center z-10 pointer-events-none backdrop-blur-[1px]">
                    <span className="bg-white text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border border-amber-100">
                      Request Pending
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: SEMESTER FORM */}
      {activeSemester && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveSemester(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <LogOut size={20} className="rotate-45" />
            </button>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">
              Semester {activeSemester}
            </h3>
            <p className="text-center text-slate-500 mb-8 text-sm">
              Enter your academic performance.
            </p>

            <form onSubmit={handleSemesterSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">
                    GPA
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-bold"
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
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">
                    Backlogs
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-bold"
                    type="number"
                    required
                    value={semForm.backlogs}
                    onChange={(e) =>
                      setSemForm({ ...semForm, backlogs: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">
                  Result Marksheet
                </label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer group bg-slate-50">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={(e) => setResultImage(e.target.files[0])}
                    accept="image/*"
                  />
                  {resultImage ? (
                    <div className="relative z-10">
                      <img
                        src={URL.createObjectURL(resultImage)}
                        className="h-40 mx-auto rounded-lg shadow-sm object-contain bg-white"
                        alt="New Upload"
                      />
                      <p className="text-xs text-green-600 mt-2 font-bold bg-green-50 inline-block px-2 py-1 rounded">
                        New Image Selected
                      </p>
                    </div>
                  ) : existingImage ? (
                    <div className="relative z-10">
                      <img
                        src={`http://localhost:5000/${existingImage}`}
                        className="h-40 mx-auto rounded-lg shadow-sm object-contain bg-white"
                        alt="Existing"
                      />
                      <p className="text-xs text-indigo-600 mt-2 font-bold bg-indigo-50 inline-block px-2 py-1 rounded">
                        Current Marksheet
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 py-6">
                      <Upload size={32} className="text-slate-300" />
                      <span className="text-sm font-medium">
                        Tap to upload result
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">
                  Remarks
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-medium resize-none"
                  rows="3"
                  value={semForm.remarks}
                  onChange={(e) =>
                    setSemForm({ ...semForm, remarks: e.target.value })
                  }
                ></textarea>
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WARNING MODAL */}
      <WarningModal
        isOpen={warning.show}
        onClose={() => setWarning({ ...warning, show: false })}
        title={warning.title}
        message={warning.msg}
      />
    </div>
  );
}
