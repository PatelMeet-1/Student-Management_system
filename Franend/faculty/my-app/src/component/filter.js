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
    <div className={`filter-container p-3 ${className}`}>
      <div className="row align-items-end g-3">
        
        {/* 🔥 TOP PERFORMERS */}
        <div className="col-md-3 col-sm-6">
          <label className="form-label fw-bold small mb-1">🏆 Top Performers</label>
          <div className="row g-1">
            <div className="col-8 pe-0">
              <div className="form-check form-check-sm">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="topPerformers"
                  checked={showTopPerformers}
                  onChange={(e) => {
                    if (e.target.checked && showFailedStudents) {
                      onToggleFailedStudents(); // ❌ Uncheck Failed first
                    }
                    onToggleTopPerformers(e); // ✅ Then toggle Top
                  }}
                />
                <label className="form-check-label small" htmlFor="topPerformers">
                  Show Top
                </label>
              </div>
            </div>
            <div className="col-4 ps-1">
              {showTopPerformers && (
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="10"
                  min="1"
                  max={topLimitMax}
                  value={topLimit || ''}
                  onChange={(e) => onTopLimitChange(e.target.value)}
                  style={{ width: '70px' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* 🔥 FAILED STUDENTS */}
        <div className="col-md-2 col-sm-6">
          <label className="form-label fw-bold small mb-1">❌ Failed</label>
          <div className="form-check form-check-sm mt-1">
            <input
              className="form-check-input"
              type="checkbox"
              id="failedStudents"
              checked={showFailedStudents}
              onChange={(e) => {
                if (e.target.checked && showTopPerformers) {
                  onToggleTopPerformers(); // ❌ Uncheck Top first
                }
                onToggleFailedStudents(e); // ✅ Then toggle Failed
              }}
            />
            <label className="form-check-label small" htmlFor="failedStudents">
              Show FAIL list
            </label>
          </div>
        </div>

        {/* 📅 SEMESTER */}
        <div className="col-md-2 col-sm-6">
          <label className="form-label fw-bold small mb-1">📅 Semester</label>
          <select
            className="form-select form-select-sm"
            value={semesterFilter}
            onChange={(e) => onSemesterChange(e.target.value)}
          >
            <option value="">All Semesters</option>
            {uniqueSemesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
        
        {/* 🔍 SEARCH */}
        <div className="col-md-3 col-sm-12">
          <label className="form-label fw-bold small mb-1">🔍 Search</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Name, Enrollment, Course, Sem, Dept..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* 🧹 CLEAR */}
        <div className="col-md-2 col-sm-6">
          <label className="form-label fw-bold small mb-1 d-none d-md-block">&nbsp;</label>
          <button
            className="btn btn-outline-light btn-sm w-100"
            onClick={onClearFilters}
          >
            🧹 Clear All
          </button>
        </div>
      </div>
      
      {/* Count Info */}
      {filteredCount !== undefined && totalFilteredCount !== undefined && (
        <div className="row mt-2">
          <div className="col-12">
            <small className="text-light">
              Showing: <strong>{filteredCount}</strong> of <strong>{totalFilteredCount}</strong> 
              results
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
