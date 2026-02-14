// PdfForm.jsx - UPDATED DESIGN
import React from "react";

export default function PdfForm({ description, setDescription, setPdf, onSubmit, editId, onReset, accept, title = "Circular" }) {
  return (
    <div className="row g-3">
      <div className="col-md-8">
        <label className="form-label fw-bold mb-2">📄 Upload File</label>
        <input
          type="file"
          accept={accept || "application/pdf"}
          className="form-control"
          onChange={(e) => setPdf(e.target.files[0])}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label fw-bold mb-2">📝 Description *</label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Enter circular description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="col-12">
        <div className="d-flex gap-2">
          <button
            className={`btn flex-fill py-2 fs-5 ${editId ? "btn-warning" : "btn-primary"}`}
            onClick={onSubmit}
          >
            {editId ? `💾 Update ${title}` : `➕ Add ${title}`}
          </button>
          <button
            className="btn btn-secondary py-2 fs-5"
            onClick={onReset}
          >
            🧹 Reset
          </button>
        </div>
      </div>
    </div>
  );
}
