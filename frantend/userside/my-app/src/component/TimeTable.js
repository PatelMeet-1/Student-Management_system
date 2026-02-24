import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

export default function TimeTable({ setError }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/timetable");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTables(data);
    } catch {
      setError("Failed to load time table");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>⏰ Time Table</h4>
        <Button onClick={fetchTables} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {tables.length > 0 ? (
        tables.map((tt) => (
          <Card key={tt._id} className="mb-3 p-4 shadow-sm">
            <h5>{tt.title}</h5>

            <p className="text-muted mb-1">
              <small>
                Uploaded on :{" "}
                {new Date(tt.createdAt).toLocaleDateString("en-GB")}
              </small>
            </p>

            <p>{tt.description}</p>

            {tt.pdf && (
              <a
                href={`http://localhost:3000${tt.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                📄 View Time Table
              </a>
            )}
          </Card>
        ))
      ) : (
        <Card className="p-4 shadow text-center">
          <p>No time table available</p>
        </Card>
      )}
    </>
  );
}
