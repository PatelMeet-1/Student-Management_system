// UnifiedSearchFilter.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UnifiedSearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...", 
  className = "" 
}) => {
  return (
    <div className={`w-100 ${className}`}>
      <h5 className="mb-3">🔍 Quick Search</h5>
      <div className="input-group">
        <input 
          className="form-control" 
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button 
          className="btn btn-outline-white bg-white ms-1" 
          type="button"
          onClick={() => onSearchChange("")}
        >
          🧹 Clear
        </button>
      </div>
    </div>
  );
};

export default UnifiedSearchFilter;
