// PdfList.jsx - UPDATED DESIGN
import React from "react";

export default function PdfList({ data, onEdit, onDelete }) {
  if (!data || data.length === 0)
    return (
      <div className="text-center py-5">
        <i className="fas fa-file-pdf fa-3x text-muted mb-3"></i>
        <p className="text-muted fst-italic">No circulars available</p>
      </div>
    );

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Date</th>
            <th>PDF</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id}>
              <td className="text-center fw-bold">{index + 1}</td>
              <td className="align-middle">
                <strong>{item.description}</strong>
              </td>
              <td className="text-center align-middle">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </td>
              <td className="text-center align-middle">
                {item.pdf ? (
                  <a
                    href={`http://localhost:3000${item.pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-info btn-sm"
                  >
                    📄 View PDF
                  </a>
                ) : (
                  <span className="badge bg-secondary">No PDF</span>
                )}
              </td>
              <td className="text-center align-middle">
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-info"
                    onClick={() => onEdit(item)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(item._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
