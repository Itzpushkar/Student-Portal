import { useState } from "react";

export default function SemesterSelector({ userData, onComplete, onCancel }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSem = userData?.currentSemester || 1;
  const maxSemester = 8; // Maximum semesters for the course

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSemester) {
      setError("Please select a semester");
      return;
    }

    if (parseInt(selectedSemester) <= currentSem) {
      setError("Cannot select a semester that is already completed or current");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get user ID from the userData or use a fallback
      const userId = userData?._id || userData?.user?._id;
      
      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      console.log("Updating semester for user:", userId);
      console.log("Selected semester:", selectedSemester);

      const response = await fetch("http://localhost:5000/api/user/select-semester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          semester: parseInt(selectedSemester)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Semester updated successfully:", result);
        alert(result.msg || "Semester updated successfully!");
        onComplete();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.msg || "Failed to update semester");
      }
    } catch (err) {
      console.error("Error updating semester:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Semester Progression</h2>
        <p className="text-gray-600">Select which semester you are promoted to</p>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Current Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-700">Current Semester: <strong className="text-primary-600">{currentSem}</strong></p>
          <p className="text-gray-700">Completed Semesters: <strong className="text-green-600">{userData?.academicDetails?.length || 0}</strong></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="semester" className="form-label">Select New Semester *</label>
          <select
            id="semester"
            name="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Choose a semester</option>
            {Array.from({ length: maxSemester }, (_, i) => i + 1)
              .filter(sem => sem > currentSem)
              .map(sem => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
          </select>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-bold text-gray-800 mb-3">Semester Rules:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              You can only select a semester higher than your current semester
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              Past semesters (1-{currentSem}) are available for editing
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              Future semesters ({currentSem + 1}+) will be unlocked after selection
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              You can update academic details for any completed semester
            </li>
          </ul>
        </div>

        <div className="flex space-x-4 pt-6">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || !selectedSemester} 
            className="btn-primary flex-1"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Updating...
              </div>
            ) : (
              "Update Semester"
            )}
          </button>
        </div>
      </form>

      {userData?.academicDetails && userData.academicDetails.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Semester History</h3>
          <div className="space-y-4">
            {Array.from({ length: maxSemester }, (_, i) => i + 1).map(sem => {
              const academic = userData.academicDetails.find(ad => ad.semester === sem);
              const isCompleted = !!academic;
              const isCurrent = sem === currentSem;
              const isFuture = sem > currentSem;

              return (
                <div 
                  key={sem} 
                  className={`timeline-item ${
                    isCompleted ? 'border-green-200 bg-green-50' : 
                    isCurrent ? 'border-blue-200 bg-blue-50' : 
                    isFuture ? 'border-gray-200 bg-gray-50' : 
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`timeline-marker ${
                    isCompleted ? 'bg-green-500' : 
                    isCurrent ? 'bg-blue-500' : 
                    isFuture ? 'bg-gray-400' : 
                    'bg-gray-300'
                  }`}>
                    {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                  </div>
                  <div className="timeline-content">
                    <h4 className="font-bold text-gray-800">Semester {sem}</h4>
                    {isCompleted ? (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">GPA: {academic.gpa || "N/A"}</p>
                        <p className="text-sm text-gray-600">Backlogs: {academic.backlogs || 0}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          Completed
                        </span>
                      </div>
                    ) : isCurrent ? (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        Current
                      </span>
                    ) : isFuture ? (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                        Future
                      </span>
                    ) : (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
