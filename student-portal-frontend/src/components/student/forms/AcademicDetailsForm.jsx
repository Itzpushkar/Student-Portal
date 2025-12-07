import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import WarningModal from "../../common/WarningModal"; // Ensure path is correct

export default function AcademicDetailsForm({ userData, onComplete }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [formData, setFormData] = useState({
    gpa: "",
    backlogs: 0,
    remarks: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState({ show: false, title: "", msg: "" });

  const isPromotionPending = userData?.promotionStatus === "pending";
  const currentSem = userData?.currentSemester || 1;

  const handleSemesterClick = (semNumber) => {
    // 1. Personal Details Check
    if (!userData.isPersonalDetailsCompleted) {
      setWarning({
        show: true,
        title: "Incomplete Profile",
        msg: "Please fill out your Personal Details completely before accessing academic records.",
      });
      return;
    }

    // 2. Strict Locking Rule
    const isUnlocked = semNumber === 1 || userData.currentSemester >= semNumber;
    if (!isUnlocked) {
      setWarning({
        show: true,
        title: "Semester Locked",
        msg: "You cannot access this semester yet. Please complete the previous semester and request promotion from the Overview tab.",
      });
      return;
    }

    if (parseInt(selectedSemester) === semNumber) {
      setSelectedSemester("");
    } else {
      setSelectedSemester(semNumber);
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      const existingSem = userData?.academicDetails?.find(
        (ad) => ad.semester === parseInt(selectedSemester)
      );
      if (existingSem) {
        setFormData({
          gpa: existingSem.gpa || "",
          backlogs: existingSem.backlogs || 0,
          remarks: existingSem.remarks || "",
        });
        setExistingImage(existingSem.marksheetImages?.[0] || null);
      } else {
        setFormData({ gpa: "", backlogs: 0, remarks: "" });
        setExistingImage(null);
      }
      setNewImage(null);
    }
  }, [selectedSemester, userData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    if (e.target.files[0]) setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userData._id);
      formDataToSend.append("semester", selectedSemester);
      formDataToSend.append("gpa", formData.gpa);
      formDataToSend.append("backlogs", formData.backlogs);
      formDataToSend.append("remarks", formData.remarks);
      if (newImage) formDataToSend.append("marksheets", newImage);

      const response = await fetch("http://localhost:5000/api/user/academic", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save");
      alert("Details Saved & Report Sent!");
      if (onComplete) onComplete();
      setSelectedSemester("");
    } catch (err) {
      setWarning({ show: true, title: "Error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Academic Details
        </h2>
        <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
          Current Semester: {currentSem}
        </div>
      </div>

      {isPromotionPending && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl flex items-center gap-3">
          <span className="text-amber-500 text-xl">⚠️</span>
          <p className="text-sm font-bold text-amber-800">
            Promotion Pending: Editing Disabled.
          </p>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-3 ml-1">
          Select Semester to Edit
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const isCompleted = userData?.academicDetails?.some(
              (ad) => ad.semester === i && ad.isCompleted
            );
            const isUnlocked = i === 1 || userData.currentSemester >= i;
            return (
              <button
                key={i}
                type="button"
                disabled={isPromotionPending}
                onClick={() => handleSemesterClick(i)}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                  parseInt(selectedSemester) === i
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                    : isCompleted
                    ? "bg-white text-green-600 border-green-200 hover:border-green-400"
                    : isUnlocked
                    ? "bg-white text-indigo-600 border-indigo-200"
                    : "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                } ${isPromotionPending ? "opacity-50" : ""}`}
              >
                Sem {i} {isCompleted && "✓"}
                {!isUnlocked && (
                  <span className="block text-[10px] font-normal">Locked</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedSemester && (
        <div className="animate-fade-in bg-slate-50 p-8 rounded-3xl border border-slate-200 relative">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Editing Semester {selectedSemester}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="number"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                required
                disabled={isPromotionPending}
                className="input-field"
                placeholder="GPA"
              />
              <input
                type="number"
                name="backlogs"
                value={formData.backlogs}
                onChange={handleChange}
                min="0"
                disabled={isPromotionPending}
                className="input-field"
                placeholder="Backlogs"
              />
            </div>

            {/* Image Preview */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-white transition-colors cursor-pointer relative bg-slate-100/50">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                accept="image/*"
                disabled={isPromotionPending}
                onChange={handleFileChange}
              />
              {newImage ? (
                <div>
                  <img
                    src={URL.createObjectURL(newImage)}
                    className="h-48 mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <p className="text-green-600 font-bold mt-2">
                    New Image Selected
                  </p>
                </div>
              ) : existingImage ? (
                <div>
                  <img
                    src={`http://localhost:5000/${existingImage}`}
                    className="h-48 mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <p className="text-indigo-600 font-bold mt-2">
                    Current Image
                  </p>
                </div>
              ) : (
                <div className="text-slate-400 py-4">
                  <Upload size={24} className="mx-auto mb-2" />
                  <span>Click to upload</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isPromotionPending}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg disabled:bg-slate-300"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </form>
        </div>
      )}

      {/* Warning Modal */}
      <WarningModal
        isOpen={warning.show}
        onClose={() => setWarning({ ...warning, show: false })}
        title={warning.title}
        message={warning.msg}
      />
      <style>{`.input-field { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: white; transition: all 0.2s; }`}</style>
    </div>
  );
}
