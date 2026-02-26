// PdfForm.jsx
import React from "react";

export default function PdfForm({
  description,
  setDescription,
  setPdf,
  onSubmit,
  editId,
  onReset,
  accept,
  title = "Circular",
}) {

  const handleSubmit = (e) => {
    e.preventDefault();     // ✅ ONLY HERE
    onSubmit();             // ✅ NO event pass
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">

        <div className="col-md-8">
          <label className="form-label fw-bold">📄 Upload File</label>
          <input
            type="file"
            accept={accept || "application/pdf"}
            className="form-control"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">📝 Description *</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button
            type="submit"
            className={`btn flex-fill ${editId ? "btn-warning" : "btn-primary"}`}
          >
            {editId ? `Update ${title}` : `Add ${title}`}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
          >
            Reset
          </button>
        </div>

      </div>
    </form>
  );
}