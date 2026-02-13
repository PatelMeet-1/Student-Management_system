import React, { useState, useEffect } from "react";
import DataCard from "./DataCard";

/**
 * ResponsiveTable Component
 * Automatically switches between table view (desktop) and card view (mobile)
 * 
 * @param {Object} props
 * @param {Array} props.data - Data to display
 * @param {Array} props.columns - Column definitions for table
 * @param {Array} props.cardColumns - Column definitions for card (if different from table columns)
 * @param {boolean} props.hover - Add hover effect to table rows
 * @param {string} props.variant - Bootstrap table variant (default, dark, striped, etc)
 * @param {string} props.emptyMessage - Message when no data
 * @param {boolean} props.showActions - Show action buttons
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 */
export default function ResponsiveTable({
  data = [],
  columns = [],
  cardColumns,
  hover = true,
  variant = "hover",
  emptyMessage = "📭 No data available",
  showActions = false,
  onEdit,
  onDelete,
  maxCardItems = 5,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use cardColumns if provided, otherwise use table columns
  const displayColumns = cardColumns || columns;

  // Mobile view - Card format
  if (isMobile) {
    return (
      <DataCard
        data={data}
        columns={displayColumns}
        emptyMessage={emptyMessage}
        onEdit={onEdit}
        onDelete={onDelete}
        showActions={showActions}
        maxVisible={maxCardItems}
      />
    );
  }

  // Desktop view - Table format
  return (
    <div className="table-responsive">
      <table className={`table table-${variant} mb-0`}>
        <thead className="table-dark">
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ minWidth: column.width || "auto" }}>
                {column.label}
              </th>
            ))}
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="text-center py-4 text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row._id || index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : row[column.key] || "N/A"}
                  </td>
                ))}
                {showActions && (
                  <td>
                    <div className="btn-group btn-group-sm">
                      {onEdit && (
                        <button
                          className="btn btn-primary"
                          onClick={() => onEdit(row)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn btn-danger"
                          onClick={() => onDelete(row._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
