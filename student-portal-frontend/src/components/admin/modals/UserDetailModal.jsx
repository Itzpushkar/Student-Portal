import { EditField, InfoRow } from "../shared/SharedComponents";

export default function UserDetailModal({
  user,
  onClose,
  onUpdate,
  modalMode,
  setModalMode,
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-800">
            {modalMode === "edit" ? "Update Details" : "User Details"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {modalMode === "read" ? (
              <>
                <InfoRow
                  label="Full Name"
                  value={user.personalDetails?.fullName || user.username}
                />
                <InfoRow label="Enrollment No" value={user.enrollmentNo} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Mobile" value={user.personalDetails?.contact} />
                <InfoRow
                  label="Date of Birth"
                  value={user.personalDetails?.dob}
                />
                <div className="col-span-2">
                  <InfoRow
                    label="Address"
                    value={user.personalDetails?.address}
                  />
                </div>
              </>
            ) : (
              <>
                <EditField
                  label="Full Name"
                  val={user.personalDetails?.fullName}
                  onChange={(v) => (user.personalDetails.fullName = v)}
                />
                <EditField
                  label="Mobile"
                  val={user.personalDetails?.contact}
                  onChange={(v) => (user.personalDetails.contact = v)}
                />
                <EditField
                  label="DOB"
                  val={user.personalDetails?.dob}
                  onChange={(v) => (user.personalDetails.dob = v)}
                />
                <div className="col-span-2">
                  <EditField
                    label="Address"
                    val={user.personalDetails?.address}
                    onChange={(v) => (user.personalDetails.address = v)}
                    full
                  />
                </div>
              </>
            )}
          </div>

          {/* Academic (Students Only) */}
          {user.role === "student" && (
            <>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Academic History
              </h4>
              {modalMode === "read" ? (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-4 gap-4">
                  {user.academicDetails?.map((sem) => (
                    <div
                      key={sem.semester}
                      className="bg-white p-3 rounded-xl border border-slate-100 text-center"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Sem {sem.semester}
                      </p>
                      <p className="text-xl font-bold text-indigo-600">
                        {sem.gpa}
                      </p>
                      <p className="text-xs text-slate-500">
                        {sem.backlogs} Backlogs
                      </p>
                    </div>
                  ))}
                  {(!user.academicDetails ||
                    user.academicDetails.length === 0) && (
                    <p className="text-sm text-slate-400 col-span-4 text-center">
                      No academic records found.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Academic records can be updated via the specific Semester
                  Update module.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {modalMode === "read" ? (
            <button
              onClick={() => setModalMode("edit")}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              Update Details
            </button>
          ) : (
            <>
              <button
                onClick={() => setModalMode("read")}
                className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={onUpdate}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
