import React from "react";

const FilterComponent = ({
  // Filter states
  searchTerm,
  semesterFilter,
  showTopPerformers,
  showFailedStudents,
  topLimit,
  
  // Filter handlers
  onSearchChange,
  onSemesterChange,
  onTopLimitChange,
  onToggleTopPerformers,
  onToggleFailedStudents,
  onClearFilters,
  
  // Data for semesters
  uniqueSemesters = [],
  
  // Status info
  filteredCount = 0,
  totalFilteredCount = 0,
  topLimitMax = 100,
  
  // Styling props
  className = ""
}) => {
  
  return (
    <div className={` ${className}`}>
      <div className="card-body p-0">
        <div className="row g-3 align-items-end">
          
          {/* 🔥 TOP PERFORMERS WITH MANUAL INPUT */}
          <div className="col-md-3">
            <label className="form-label fw-bold mb-1">🏆 Top Performers</label>
            <div className="row g-2">
              <div className="col-8">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="topPerformers"
                    checked={showTopPerformers}
                    onChange={onToggleTopPerformers}
                  />
                  <label className="form-check-label" htmlFor="topPerformers">
                    Show Top
                  </label>
                </div>
              </div>
              <div className="col-4">
                {showTopPerformers && (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="10"
                    min="1"
                    max={topLimitMax}
                    value={topLimit}
                    onChange={onTopLimitChange}
                    style={{ width: '70px' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 🔥 FAILED STUDENTS */}
          <div className="col-md-2">
            <label className="form-label fw-bold">❌ Failed Students</label>
            <div className="form-check mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="failedStudents"
                checked={showFailedStudents}
                onChange={onToggleFailedStudents}
              />
              <label className="form-check-label small" htmlFor="failedStudents">
                Show FAIL list
              </label>
            </div>
          </div>

          {/* 📅 SEMESTER */}
          <div className="col-md-2">
            <label className="form-label fw-bold">📅 Semester</label>
            <select
              className="form-select"
              value={semesterFilter}
              onChange={onSemesterChange}
            >
              <option value="">All Semesters</option>
              {uniqueSemesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          
          {/* 🔍 SEARCH */}
          <div className="col-md-3">
            <label className="form-label fw-bold">🔍 Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name, Enrollment, Course, Sem, Dept..."
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
          
          {/* 🧹 CLEAR */}
          <div className="col-md-2">
            <button
              className="btn btn-outline bg-white w-100"
              onClick={onClearFilters}
            >
              🧹 Clear All
            </button>
          </div>
        </div>
        
     
      </div>
    </div>
  );
};

export default FilterComponent;
