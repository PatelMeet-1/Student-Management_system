import React from "react";

const FilterComponent = ({
  searchTerm,
  semesterFilter,
  courseFilter,
  departmentFilter,
  showTopPerformers,
  showFailedStudents,
  topLimit,

  onSearchChange,
  onSemesterChange,
  onCourseChange,
  onDepartmentChange,
  onTopLimitChange,
  onToggleTopPerformers,
  onToggleFailedStudents,
  onClearFilters,

  uniqueSemesters = [],
  uniqueCourses = [],
  uniqueDepartments = [],

  filteredCount = 0,
  totalFilteredCount = 0,
  topLimitMax = 100,
  className = ""
}) => {
  return (
    <div className={`card-body ${className}`}>
<div className="row g-2 align-items-end flex-wrap flex-md-nowrap">

    {/* 🏆 TOP */}
    <div className="col-auto">
      <label className="form-label fw-bold small">🏆 Top</label>
      <div className="d-flex align-items-center gap-2">
        <input
          type="checkbox"
          className="form-check-input mt-0"
          checked={showTopPerformers}
          onChange={onToggleTopPerformers}
        />
        <input
          type="number"
          className="form-control form-control-sm"
          style={{ width: "70px" }}
          min="1"
          max={topLimitMax}
          disabled={!showTopPerformers}
          value={topLimit}
          onChange={onTopLimitChange}
        />
      </div>
    </div>

    {/* ❌ FAIL */}
    <div className="col-auto">
      <input
        className="form-check-input ms-2"
        type="checkbox"
        checked={showFailedStudents}
        onChange={onToggleFailedStudents}
      />
      <label className="form-label fw-bold small">❌ Fail</label>
    </div>

    {/* 📚 COURSE */}
    <div className="col-auto">
      <label className="form-label fw-bold small">📚 Course</label>
      <select className="form-select form-select-sm" value={courseFilter} onChange={onCourseChange}>
        <option value="">All</option>
        {uniqueCourses.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* 🏢 DEPARTMENT */}
    <div className="col-auto">
      <label className="form-label fw-bold small">🏢 Dept</label>
      <select className="form-select form-select-sm" value={departmentFilter} onChange={onDepartmentChange}>
        <option value="">All</option>
        {uniqueDepartments.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>

    {/* 📅 SEMESTER */}
    <div className="col-auto">
      <label className="form-label fw-bold small">📅 Sem</label>
      <select className="form-select form-select-sm" value={semesterFilter} onChange={onSemesterChange}>
        <option value="">All</option>
        {uniqueSemesters.map(sem => (
          <option key={sem} value={sem}>{sem}</option>
        ))}
      </select>
    </div>

    {/* 🔍 SEARCH */}
    <div className="col-auto">
      <label className="form-label fw-bold small">🔍 Search</label>
      <input
        type="text"
        className="form-control form-control-sm"
        style={{ width: "220px" }}
        placeholder="Search..."
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>

    {/* 🧹 CLEAR */}
    <div className="col-auto">
      <button className="btn  btn-sm mt-4 bg-white" onClick={onClearFilters}>
        🧹 Clear
      </button>
    </div>

  </div>


</div>

  );
};

export default FilterComponent;
