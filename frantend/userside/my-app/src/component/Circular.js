// src/pages/user/Circular.jsx
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

export default function Circular({ setError }) {
  const API_URL = process.env.REACT_APP_API_URL; // https://site.com/api
  const BASE_URL = API_URL.replace("/api", ""); // https://site.com

  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCirculars = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/circular`);
      if (!res.ok) throw new Error("Failed to fetch circulars");
      const data = await res.json();
      setCirculars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError?.("Failed to load circulars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>📢 Circular</h4>
        <Button onClick={fetchCirculars} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {circulars.length > 0 ? (
        circulars.map((c) => (
          <Card key={c._id} className="mb-3 p-4 shadow-sm">
            <h5>{c.title}</h5>

            <p className="text-muted mb-1">
              <small>
                Uploaded on:{" "}
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </small>
            </p>

            <p>{c.description}</p>

            {c.pdf && (
              <a
                href={`${BASE_URL}${c.pdf}`}   // ✅ FIXED
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                📄 View Circular
              </a>
            )}
          </Card>
        ))
      ) : (
        <Card className="p-4 shadow text-center">
          <p>No circulars available</p>
        </Card>
      )}
    </>
  );
}