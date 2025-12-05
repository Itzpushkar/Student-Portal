import { useState, useEffect } from "react";

export default function PersonalDetailsForm({
  userData,
  onComplete,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    contact: "",
    address: "",
    tenthPercentage: "", // Field exists
    course: "",
    branch: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- POPULATE FORM DATA ---
  useEffect(() => {
    if (userData && userData.personalDetails) {
      setFormData({
        fullName: userData.personalDetails.fullName || userData.username || "",
        dob: userData.personalDetails.dob || "",
        contact: userData.personalDetails.contact || "",
        address: userData.personalDetails.address || "",
        // Ensure data maps correctly from DB
        tenthPercentage: userData.personalDetails.tenthPercentage || "",
        course: userData.personalDetails.course || "",
        branch: userData.personalDetails.branch || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "contact") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.contact.length !== 10) {
      setError("Contact number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      const userId = userData?._id || userData?.user?._id;
      if (!userId) {
        setError("User ID not found.");
        return;
      }

      const data = new FormData();
      data.append("userId", userId);
      // Append text fields including tenthPercentage
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      const response = await fetch("http://localhost:5000/api/user/personal", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      if (response.ok) {
        // This callback is crucial for Issue 2 (It tells parent to refetch user data)
        onComplete();
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to save details");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Personal Details
        </h2>
        <p className="text-slate-500 text-sm">
          Please keep your profile updated.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROFILE PHOTO UPLOAD */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden mb-3 border-4 border-slate-50 shadow-sm relative group">
            {profilePhoto ? (
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : userData?.personalDetails?.profilePhoto ? (
              <img
                src={`http://localhost:5000/${userData.personalDetails.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}

            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Change</span>
            </div>
          </div>

          <label className="cursor-pointer text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors">
            Upload New Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              maxLength={10}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              10th Percentage
            </label>
            <input
              type="number"
              name="tenthPercentage"
              value={formData.tenthPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="input-field"
              placeholder="e.g. 85.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Course
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="input-field appearance-none"
            >
              <option value="">Select Course</option>
              <option value="Diploma">Diploma</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.E">B.E</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Branch
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="input-field appearance-none"
              required
            >
              <option value="">Select Branch</option>
              {["Computer", "Mechanical", "Civil", "Electrical", "EC"].map(
                (b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="input-field resize-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
          >
            {loading ? "Saving Details..." : "Save Changes"}
          </button>
        </div>
      </form>

      <style>{`
        .input-field { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: #f8fafc; color: #334155; font-weight: 500; transition: all 0.2s; } 
        .input-field:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
      `}</style>
    </div>
  );
}
