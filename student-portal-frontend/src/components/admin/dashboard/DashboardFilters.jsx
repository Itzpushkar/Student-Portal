export default function DashboardFilters({
  activeTab,
  branch,
  setBranch,
  semester,
  setSemester,
  year,
  setYear,
  searchQuery,
  setSearchQuery,
  activityDate,
  setActivityDate,
  tabs,
}) {
  // 1. Activity Tab Filters
  if (activeTab === "activities") {
    return (
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm">
        <input
          className="filter-input"
          placeholder="Search Activity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="date"
          className="filter-input"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
        />
      </div>
    );
  }

  // 2. Hide filters ONLY for requests or WIP tabs
  // FIX: Removed 'admins' from this list so the dropdowns appear for Admins too
  if (
    ["requests"].includes(activeTab) ||
    tabs.find((t) => t.id === activeTab)?.wip
  )
    return null;

  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 animate-fade-in">
      {/* Branch Dropdown (Visible for Students, Admins, Passout, Banned, Suspended) */}
      <select
        className="filter-select"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
      >
        <option value="">
          Select Branch {activeTab === "admins" ? "(All)" : "(Required)"}
        </option>
        {["Computer", "Mechanical", "Civil", "Electrical", "EC"].map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      {/* Semester Dropdown (Only for Student-related tabs) */}
      {["students", "banned", "suspended"].includes(activeTab) && branch && (
        <select
          className="filter-select"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester (All)</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
      )}

      {/* Year Dropdown (Only for Passout) */}
      {activeTab === "passout" && branch && (
        <select
          className="filter-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Passing Year</option>
          {[2020, 2021, 2022, 2023, 2024].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
