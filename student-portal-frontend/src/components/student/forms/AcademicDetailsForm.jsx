import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

export default function AcademicDetailsForm({ userData, onComplete }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [formData, setFormData] = useState({
    gpa: "",
    backlogs: 0,
    remarks: "",
  });
  // Changed from array to single file for preview logic consistency
  const [newImage, setNewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPromotionPending = userData?.promotionStatus === "pending";
  const currentSem = userData?.currentSemester || 1;

  const handleSemesterClick = (semNumber) => {
    // Check if personal details are filled before allowing click
    if (!userData.isPersonalDetailsCompleted) {
      alert("Please fill Personal Details first!");
      return;
    }

    if (parseInt(selectedSemester) === semNumber) {
      setSelectedSemester("");
    } else {
      setSelectedSemester(semNumber);
    }
  };

  // Populate Form Data & Images when Semester is Selected
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
        // Set existing image for preview
        setExistingImage(existingSem.marksheetImages?.[0] || null);
      } else {
        setFormData({ gpa: "", backlogs: 0, remarks: "" });
        setExistingImage(null);
      }
      setNewImage(null); // Clear any new selection when switching tabs
    }
  }, [selectedSemester, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gpa" && (value < 0 || value > 10)) return;
    if (name === "backlogs" && value < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userId = userData?._id || userData?.user?._id;
      if (!userId) throw new Error("User ID not found");

      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("semester", selectedSemester);
      formDataToSend.append("gpa", formData.gpa);
      formDataToSend.append("backlogs", formData.backlogs);
      formDataToSend.append("remarks", formData.remarks);

      // Append Image
      if (newImage) {
        formDataToSend.append("marksheets", newImage);
      }

      const response = await fetch("http://localhost:5000/api/user/academic", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.msg);

      alert("Details Saved & Report Sent!");

      if (onComplete) onComplete();
      setSelectedSemester("");
    } catch (err) {
      setError(err.message);
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

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm text-center font-medium">
          {error}
        </div>
      )}

      {/* PROMOTION PENDING BANNER */}
      {isPromotionPending && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl flex items-center gap-3">
          <span className="text-amber-500 text-xl">⚠️</span>
          <p className="text-sm font-bold text-amber-800">
            Promotion Pending: You cannot edit details until approved.
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
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                } ${isPromotionPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Sem {i} {isCompleted && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      {selectedSemester && (
        <div className="animate-fade-in bg-slate-50 p-8 rounded-3xl border border-slate-200 relative">
          <div className="absolute top-0 left-8 -mt-2 w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Editing Semester {selectedSemester}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                  GPA (0-10)
                </label>
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
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                  Backlogs
                </label>
                <input
                  type="number"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  min="0"
                  disabled={isPromotionPending}
                  className="input-field"
                />
              </div>
            </div>

            {/* IMAGE PREVIEW SECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Result Marksheet
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-white transition-colors cursor-pointer relative bg-slate-100/50 group">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  accept="image/*"
                  disabled={isPromotionPending}
                  onChange={handleFileChange}
                />

                {newImage ? (
                  <div className="relative z-10">
                    <img
                      src={URL.createObjectURL(newImage)}
                      className="h-48 mx-auto rounded-lg shadow-sm object-contain bg-white border border-slate-200"
                      alt="New Upload"
                    />
                    <p className="text-xs text-green-600 mt-3 font-bold bg-green-50 inline-block px-3 py-1 rounded-full">
                      New Image Selected
                    </p>
                  </div>
                ) : existingImage ? (
                  <div className="relative z-10">
                    <img
                      src={`http://localhost:5000/${existingImage}`}
                      className="h-48 mx-auto rounded-lg shadow-sm object-contain bg-white border border-slate-200"
                      alt="Existing"
                    />
                    <p className="text-xs text-indigo-600 mt-3 font-bold bg-indigo-50 inline-block px-3 py-1 rounded-full">
                      Current Marksheet
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Click or Drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400 py-8">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-medium">
                      Click to upload result image
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                disabled={isPromotionPending}
                className="input-field resize-none"
                rows="3"
                placeholder="Optional remarks..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || isPromotionPending}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? "Saving Details..." : "Save Semester Details"}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .input-field { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: white; color: #334155; font-weight: 500; transition: all 0.2s; } 
        .input-field:focus { border-color: #6366f1; ring: 4px solid rgba(99, 102, 241, 0.1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
