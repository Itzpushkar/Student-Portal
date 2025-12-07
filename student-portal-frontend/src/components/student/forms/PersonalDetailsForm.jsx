import { useState, useEffect } from "react";
import WarningModal from "../../common/WarningModal";
import ChangePasswordModal from "../modals/ChangePasswordModal"; // Import Modal
import { Lock } from "lucide-react";

export default function PersonalDetailsForm({
  userData,
  onComplete,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    contact: "",
    address: "",
    tenthPercentage: "",
    course: "Diploma",
    branch: "",
    enrollmentNo: "",
  });
  const [originalEmail, setOriginalEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Modal State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData) {
      const email = userData.email || "";
      setOriginalEmail(email);
      setFormData({
        fullName: userData.personalDetails?.fullName || userData.username || "",
        email: email,
        dob: userData.personalDetails?.dob || "",
        contact: userData.personalDetails?.contact || "",
        address: userData.personalDetails?.address || "",
        tenthPercentage: userData.personalDetails?.tenthPercentage || "",
        course: "Diploma",
        branch: userData.personalDetails?.branch || "",
        enrollmentNo: userData.enrollmentNo || "",
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

  const handleFileChange = (e) => setProfilePhoto(e.target.files[0]);

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (formData.contact.length !== 10) {
      setError("Contact number must be exactly 10 digits");
      return;
    }
    if (formData.email !== originalEmail) {
      setShowEmailConfirm(true);
    } else {
      submitData();
    }
  };

  const handleRevertEmail = () => {
    setFormData((prev) => ({ ...prev, email: originalEmail }));
    setShowEmailConfirm(false);
  };

  const submitData = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = userData?._id || userData?.user?._id;
      if (!userId) {
        setError("User ID not found.");
        return;
      }

      const data = new FormData();
      data.append("userId", userId);
      Object.keys(formData).forEach((key) => {
        if (key !== "enrollmentNo") data.append(key, formData[key]);
      });
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      const response = await fetch("http://localhost:5000/api/user/personal", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      if (response.ok) {
        setShowEmailConfirm(false);
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
    <div className="bg-white relative">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Personal Details
          </h2>
          <p className="text-slate-500 text-sm">
            Please keep your profile updated.
          </p>
        </div>

        {/* Change Password Trigger */}
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
        >
          <Lock size={14} /> Change Password
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handlePreSubmit} className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Enrollment No
            </label>
            <input
              type="text"
              value={formData.enrollmentNo}
              readOnly
              className="input-field bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
            />
          </div>
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
              Registered Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
              Course
            </label>
            <select
              name="course"
              value={formData.course}
              disabled
              className="input-field appearance-none bg-slate-50 cursor-not-allowed"
            >
              <option value="Diploma">Diploma</option>
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

      {/* MODALS */}
      {showEmailConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-100 relative">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm border border-amber-200">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Change Registered Email?
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Are you sure you want to change your registered email id? If you
              change your email id then you have to use that email id in future
              for login and forgetting password.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRevertEmail}
                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                No, Keep Old
              </button>
              <button
                onClick={submitData}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg transition-colors"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <style>{`.input-field { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: #f8fafc; color: #334155; font-weight: 500; transition: all 0.2s; } .input-field:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); } .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }`}</style>
    </div>
  );
}
