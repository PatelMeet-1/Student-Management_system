import React from "react";

/**
 * CardViewDemo Component
 * Demonstrates how table data converts to card format on mobile
 */
export default function CardViewDemo() {
  const sampleData = [
    {
      _id: 1,
      name: "John Smith",
      enrollment: "ENG-2021-001",
      course: "B.Tech",
      department: "CSE",
      contact: "9999999999",
      email: "john@example.com",
    },
    {
      _id: 2,
      name: "Jane Doe",
      enrollment: "ENG-2021-002",
      course: "B.Tech",
      department: "ECE",
      contact: "8888888888",
      email: "jane@example.com",
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f4f7fa", borderRadius: "8px" }}>
      <h3 style={{ marginBottom: "20px" }}>📱 Card View Example (Mobile View)</h3>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        On mobile devices (&lt;767px), tables automatically convert to cards. Resize your browser to see the effect!
      </p>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Enrollment</th>
              <th>Course</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, i) => (
              <tr key={row._id}>
                <td>{i + 1}</td>
                <td>{row.name}</td>
                <td>
                  <strong>{row.enrollment}</strong>
                </td>
                <td>{row.course}</td>
                <td>{row.department}</td>
                <td>{row.contact}</td>
                <td>{row.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px", padding: "15px", background: "#e8f4f8", borderRadius: "8px" }}>
        <h5>💡 How It Works:</h5>
        <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
          <li><strong>Desktop (≥768px):</strong> Data displays as a table</li>
          <li><strong>Mobile (&lt;768px):</strong> Each row converts to a card with labels</li>
          <li><strong>No Code Changes:</strong> Just use normal table HTML</li>
          <li><strong>Pure CSS:</strong> No JavaScript needed for conversion</li>
          <li><strong>Responsive Design:</strong> Automatically adjusts on resize</li>
        </ul>
      </div>
    </div>
  );
}
