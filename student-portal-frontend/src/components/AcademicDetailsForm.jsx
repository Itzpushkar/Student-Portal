import { useState, useEffect } from "react";

export default function AcademicDetailsForm({ userData, onComplete, onCancel }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [formData, setFormData] = useState({
    gpa: "",
    backlogs: 0,
    remarks: ""
  });
  const [marksheetFiles, setMarksheetFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableSemesters = [];
  const currentSem = userData?.currentSemester || 1;
  
  // Generate available semesters based on current semester
  for (let i = 1; i <= currentSem; i++) {
    const existingSem = userData?.academicDetails?.find(ad => ad.semester === i);
    availableSemesters.push({
      value: i,
      label: `Semester ${i}`,
      status: existingSem ? "completed" : "available"
    });
  }

  useEffect(() => {
    if (selectedSemester) {
      const existingSem = userData?.academicDetails?.find(ad => ad.semester === parseInt(selectedSemester));
      if (existingSem) {
        setFormData({
          gpa: existingSem.gpa || "",
          backlogs: existingSem.backlogs || 0,
          remarks: existingSem.remarks || ""
        });
      } else {
        setFormData({
          gpa: "",
          backlogs: 0,
          remarks: ""
        });
      }
    }
  }, [selectedSemester, userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMarksheetFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSemester) {
      setError("Please select a semester");
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

      console.log("Saving academic details for user:", userId);
      console.log("Semester:", selectedSemester);
      console.log("Form data:", formData);

      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("semester", selectedSemester);
      formDataToSend.append("gpa", formData.gpa);
      formDataToSend.append("backlogs", formData.backlogs);
      formDataToSend.append("remarks", formData.remarks);

      // Append files
      marksheetFiles.forEach((file, index) => {
        formDataToSend.append("marksheets", file);
      });

      const response = await fetch("http://localhost:5000/api/user/academic", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Academic details saved successfully:", result);
        alert(result.msg || "Academic details saved successfully! PDF has been generated and sent to your email.");
        onComplete();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.msg || "Failed to save academic details");
      }
    } catch (err) {
      console.error("Error saving academic details:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Academic Details Form</h2>
        <p className="text-gray-600">Fill in your academic information for each semester</p>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="semester" className="form-label">Select Semester *</label>
          <select
            id="semester"
            name="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Choose a semester</option>
            {availableSemesters.map(sem => (
              <option key={sem.value} value={sem.value}>
                {sem.label} {sem.status === "completed" ? "(Update)" : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedSemester && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="gpa" className="form-label">GPA/CGPA</label>
                <input
                  type="number"
                  id="gpa"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="Enter your GPA"
                  min="0"
                  max="10"
                  step="0.01"
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="backlogs" className="form-label">Number of Backlogs</label>
                <input
                  type="number"
                  id="backlogs"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  placeholder="Enter number of backlogs"
                  min="0"
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="remarks" className="form-label">Remarks/Additional Notes</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any additional remarks or notes"
                rows="3"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="marksheets" className="form-label">Upload Marksheet Images</label>
              <input
                type="file"
                id="marksheets"
                name="marksheets"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-2">You can upload multiple images (JPG, PNG, etc.)</p>
              {marksheetFiles.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <p className="font-medium text-gray-700 mb-2">Selected files:</p>
                  <ul className="space-y-1">
                    {marksheetFiles.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

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
                Saving...
              </div>
            ) : (
              "Save & Generate PDF"
            )}
          </button>
        </div>
      </form>

      {userData?.academicDetails && userData.academicDetails.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Completed Semesters</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.academicDetails
              .sort((a, b) => a.semester - b.semester)
              .map((sem) => (
                <div key={sem.semester} className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-bold text-gray-800 mb-2">Semester {sem.semester}</h4>
                  <p className="text-sm text-gray-600">GPA: {sem.gpa || "N/A"}</p>
                  <p className="text-sm text-gray-600">Backlogs: {sem.backlogs || 0}</p>
                  {sem.remarks && <p className="text-sm text-gray-600">Remarks: {sem.remarks}</p>}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
