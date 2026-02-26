// src/pages/user/TimeTable.jsx
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

export default function TimeTable({ setError }) {
  const API_URL = process.env.REACT_APP_API_URL; // https://site.com/api
  const BASE_URL = API_URL.replace("/api", ""); // https://site.com

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/timetable`);
      if (!res.ok) throw new Error("Failed to fetch timetable");
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError?.("Failed to load timetable");
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
                Uploaded on:{" "}
                {new Date(tt.createdAt).toLocaleDateString("en-GB")}
              </small>
            </p>

            <p>{tt.description}</p>

            {tt.pdf && (
              <a
                href={`${BASE_URL}${tt.pdf}`}   // ✅ FIXED
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