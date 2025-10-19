import { useState, useEffect } from "react";

export default function PersonalDetailsForm({ userData, onComplete, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    contact: "",
    address: "",
    tenthPercentage: "",
    course: "",
    branch: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData?.personalDetails) {
      setFormData({
        fullName: userData.personalDetails.fullName || "",
        dob: userData.personalDetails.dob || "",
        contact: userData.personalDetails.contact || "",
        address: userData.personalDetails.address || "",
        tenthPercentage: userData.personalDetails.tenthPercentage || "",
        course: userData.personalDetails.course || "",
        branch: userData.personalDetails.branch || ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get user ID from the userData or use a fallback
      const userId = userData?._id || userData?.user?._id;
      
      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      console.log("Saving personal details for user:", userId);
      console.log("Form data:", formData);

      const response = await fetch("http://localhost:5000/api/user/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          personalDetails: formData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Personal details saved successfully:", result);
        alert("Personal details saved successfully! Now you can fill your academic details.");
        onComplete();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.msg || "Failed to save personal details");
      }
    } catch (err) {
      console.error("Error saving personal details:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Personal Details Form</h2>
        <p className="text-gray-600">Please fill in your personal information</p>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact" className="form-label">Contact Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="tenthPercentage" className="form-label">10th Percentage</label>
            <input
              type="number"
              id="tenthPercentage"
              name="tenthPercentage"
              value={formData.tenthPercentage}
              onChange={handleChange}
              placeholder="Enter your 10th percentage"
              min="0"
              max="100"
              step="0.01"
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="course" className="form-label">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Course</option>
              <option value="Diploma">Diploma</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.E">B.E</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.Com">B.Com</option>
              <option value="BBA">BBA</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="branch" className="form-label">Branch/Stream</label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Enter your branch or stream"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your complete address"
            rows="3"
            className="input-field"
          />
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
            disabled={loading} 
            className="btn-primary flex-1"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Personal Details"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
