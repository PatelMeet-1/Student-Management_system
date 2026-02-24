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

  topLimitMax = 100,
}) => {
  return (
    <div className="card-body p-2 p-md-3">
      <div className="row g-2 align-items-end">

        {/* 🏆 TOP */}
        <div className="col-6 col-sm-4 col-md-3 col-xl-auto">
          <label className="form-label fw-semibold small d-block mb-1">🏆 Top</label>
          <div className="d-flex gap-1 align-items-center">
            <input
              type="checkbox"
              className="form-check-input mt-0"
              checked={showTopPerformers}
              onChange={onToggleTopPerformers}
            />
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: "60px" }}
              min="1"
              max={topLimitMax}
              disabled={!showTopPerformers}
              value={topLimit}
              onChange={onTopLimitChange}
            />
          </div>
        </div>

        {/* ❌ FAIL */}
        <div className="col-6 col-sm-4 col-md-3 col-xl-auto">
          <label className="form-label fw-semibold small d-block mb-1">❌ Fail</label>
          <div>
            <input
              type="checkbox"
              className="form-check-input mt-0"
              checked={showFailedStudents}
              onChange={onToggleFailedStudents}
            />
          </div>
        </div>

        {/* 📚 COURSE */}
        <div className="col-6 col-sm-4 col-md-3 col-xl-auto">
          <label className="form-label fw-semibold small d-block mb-1">📚 Course</label>
          <select
            className="form-select form-select-sm"
            value={courseFilter}
            onChange={onCourseChange}
          >
            <option value="">All</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 🏢 DEPARTMENT */}
        <div className="col-6 col-sm-4 col-md-3 col-xl-auto">
          <label className="form-label fw-semibold small d-block mb-1">🏢 Dept</label>
          <select
            className="form-select form-select-sm"
            value={departmentFilter}
            onChange={onDepartmentChange}
          >
            <option value="">All</option>
            {uniqueDepartments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* 📅 SEMESTER */}
        <div className="col-6 col-sm-4 col-md-3 col-xl-auto">
          <label className="form-label fw-semibold small d-block mb-1">📅 Sem</label>
          <select
            className="form-select form-select-sm"
            value={semesterFilter}
            onChange={onSemesterChange}
          >
            <option value="">All</option>
            {uniqueSemesters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* 🔍 SEARCH */}
        <div className="col-12 col-sm-6 col-md-5 col-xl-3">
          <label className="form-label fw-semibold small d-block mb-1">🔍 Search</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        {/* 🧹 CLEAR */}
        <div className="col-12 col-sm-6 col-md-4 col-xl-auto">
          <label className="form-label fw-semibold small d-block mb-1 invisible">Clear</label>
          <button
            className="btn  btn-sm w-100 w-xl-auto bg-white"
            onClick={onClearFilters}
          >
            🧹 Clear
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterComponent;
