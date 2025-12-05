import { useState, useEffect } from "react";

export default function AcademicDetailsForm({ userData, onComplete }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [formData, setFormData] = useState({
    gpa: "",
    backlogs: 0,
    remarks: "",
  });
  const [marksheetFiles, setMarksheetFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- FIX FOR ISSUE 2: PERSISTENT BUTTON STATE ---
  const isPromotionPending = userData?.promotionStatus === "pending";

  const currentSem = userData?.currentSemester || 1;
  const isCurrentSemCompleted = userData?.academicDetails?.find(
    (ad) => ad.semester === currentSem
  )?.isCompleted;

  const handleSemesterClick = (semNumber) => {
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
      } else {
        setFormData({ gpa: "", backlogs: 0, remarks: "" });
      }
    }
  }, [selectedSemester, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gpa" && (value < 0 || value > 10)) return;
    if (name === "backlogs" && value < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setMarksheetFiles(Array.from(e.target.files));
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

      marksheetFiles.forEach((file) =>
        formDataToSend.append("marksheets", file)
      );

      const response = await fetch("http://localhost:5000/api/user/academic", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.msg);

      alert("Details saved successfully!");

      if (onComplete) onComplete();
      setSelectedSemester("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPromotion = async () => {
    if (!confirm("Are you sure you want to request promotion?")) return;

    try {
      setLoading(true);
      const userId = userData?._id || userData?.user?._id;
      const res = await fetch(
        "http://localhost:5000/api/user/request-promotion",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Promotion request sent!");
        if (onComplete) onComplete();
      } else {
        alert(data.msg);
      }
    } catch (err) {
      alert("Failed to request promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Academic Details</h2>
        <div className="mt-2 inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Current Semester: {currentSem}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* PROMOTION PENDING BANNER */}
      {isPromotionPending && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have a pending promotion request. You cannot edit details
                until it is approved.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Semester to Edit
        </label>
        <div className="flex gap-2 flex-wrap">
          {[...Array(currentSem)].map((_, i) => (
            <button
              key={i + 1}
              type="button"
              disabled={isPromotionPending}
              onClick={() => handleSemesterClick(i + 1)}
              className={`px-4 py-2 rounded-lg border transition-all transform hover:scale-105 ${
                parseInt(selectedSemester) === i + 1
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${isPromotionPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Semester {i + 1}
              {userData?.academicDetails?.find((ad) => ad.semester === i + 1)
                ?.isCompleted && " ✓"}
            </button>
          ))}
        </div>
      </div>

      {selectedSemester && (
        <div className="animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 border-t pt-6 bg-gray-50 p-6 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA (0-10) *
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
                  className="input-field w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backlogs
                </label>
                <input
                  type="number"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  min="0"
                  disabled={isPromotionPending}
                  className="input-field w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                disabled={isPromotionPending}
                className="w-full p-2 border rounded disabled:bg-gray-200"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Marksheets (Image)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={isPromotionPending}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isPromotionPending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </form>
        </div>
      )}

      {isCurrentSemCompleted && !selectedSemester && (
        <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 text-center">
          <h3 className="text-lg font-bold text-green-800 mb-2">
            Ready for Next Semester?
          </h3>
          <p className="text-green-700 mb-4">
            You have completed Semester {currentSem}.
          </p>

          {isPromotionPending ? (
            <button
              disabled
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg cursor-not-allowed font-semibold shadow-sm"
            >
              ⏳ Request Pending Approval...
            </button>
          ) : (
            <button
              onClick={handleRequestPromotion}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md font-semibold transition-all"
            >
              Request Promotion to Semester {currentSem + 1}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
