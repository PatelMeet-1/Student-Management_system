import React from "react";

/**
 * DataCard Component - Reusable component for displaying data as cards
 * Used for mobile-friendly display of tabular data
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of items to display
 * @param {Array} props.columns - Array of column definitions: {key, label, render}
 * @param {string} props.emptyMessage - Message when no data available
 * @param {Function} props.onDelete - Delete handler function
 * @param {Function} props.onEdit - Edit handler function
 * @param {boolean} props.showActions - Show action buttons
 */
export default function DataCard({
  data = [],
  columns = [],
  emptyMessage = "📭 No data available",
  onDelete,
  onEdit,
  showActions = false,
  maxVisible = 5,
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p style={{ fontSize: "18px" }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {data.slice(0, maxVisible).map((item, index) => (
        <div
          key={item._id || index}
          className="mobile-card"
          style={{
            borderLeft: "4px solid #00ffe0",
          }}
        >
          {/* Card Header with Index */}
          <div
            className="mobile-card-row"
            style={{
              fontWeight: "bold",
              color: "#00ffe0",
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            Item #{index + 1}
          </div>

          {/* Card Content */}
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="mobile-card-row">
              <span className="mobile-card-label">{column.label}</span>
              <span className="mobile-card-value">
                {column.render
                  ? column.render(item[column.key], item)
                  : item[column.key] || "N/A"}
              </span>
            </div>
          ))}

          {/* Action Buttons */}
          {showActions && (
            <div
              className="mobile-card-row"
              style={{
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #ddd",
              }}
            >
              <div className="w-100 d-flex gap-2">
                {onEdit && (
                  <button
                    className="btn btn-sm btn-primary flex-grow-1"
                    onClick={() => onEdit(item)}
                  >
                    ✏️ Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className="btn btn-sm btn-danger flex-grow-1"
                    onClick={() => onDelete(item._id)}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Load More Message */}
      {data.length > maxVisible && (
        <div className="text-center py-3 text-muted">
          <small>Showing {maxVisible} of {data.length} items</small>
        </div>
      )}
    </div>
  );
}
