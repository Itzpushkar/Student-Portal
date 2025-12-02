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
    tenthPercentage: "",
    course: "",
    branch: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
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
      data.append("fullName", formData.fullName);
      data.append("dob", formData.dob);
      data.append("contact", formData.contact);
      data.append("address", formData.address);
      data.append("tenthPercentage", formData.tenthPercentage);
      data.append("course", formData.course);
      data.append("branch", formData.branch);

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      const response = await fetch("http://localhost:5000/api/user/personal", {
        method: "POST",
        credentials: "include", // <--- CRITICAL FIX: Sends the auth cookie
        body: data,
      });

      if (response.ok) {
        onComplete();
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(errorData.msg || "Failed to save details");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Personal Details
        </h2>
        <p className="text-gray-500">Complete your profile to proceed</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROFILE PHOTO INPUT */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-2 border-2 border-gray-300">
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
              <span className="text-gray-400 text-2xl">📷</span>
            )}
          </div>
          <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            Upload Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number (10 digits) *
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              10th Percentage *
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Course</option>
              <option value="Diploma">Diploma</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.E">B.E</option>
              <option value="B.Sc">B.Sc</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch/Stream
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
          >
            {loading ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
