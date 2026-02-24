import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

export default function Circular({ loggedUser, setError }) {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCirculars = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/circular");
      if (!res.ok) throw new Error("Failed to fetch circulars");
      const data = await res.json();
      setCirculars(data);
    } catch {
      setError("Failed to load circulars");
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
        circulars.map((circular) => (
          <Card key={circular._id} className="mb-3 p-4 shadow-sm">
            <h5>{circular.title}</h5>

            {/* ✅ Upload Date */}
            <p className="text-muted mb-1">
              <small>
                Uploaded on :{" "}
                {circular.createdAt
                  ? new Date(circular.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </small>
            </p>

            <p>{circular.description}</p>

            {/* ✅ View PDF */}
            {circular.pdf && (
              <a
                href={`http://localhost:3000${circular.pdf}`}
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
