import React, { useEffect, useState } from "react";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import axios from "axios";

// API endpoint
const API = "http://localhost:3000/api/results";

// ================= PASS/FAIL LOGIC =================
const checkPassFail = (subjects) => {
  if (!subjects || subjects.length === 0) return "N/A";

  // Fail if any subject has less than 33%
  const failed = subjects.some((s) => {
    const ratio = (s.marks || 0) / (s.maxMarks || 1); // prevent divide by 0
    return ratio < 0.33;
  });

  return failed ? "Fail" : "Pass";
};

export default function InternalExamResult({ loggedUser, setError }) {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH INTERNAL RESULTS ONLY =================
  const fetchInternalResults = async () => {
    if (!loggedUser?._id) return;
    setLoading(true);
    try {
      // 🔥 FIXED: SIRF INTERNAL + PUBLISHED + STUDENT MATCH
      const res = await axios.get(`${API}/published?type=internal`);
      const allResults = res.data.data || [];

      // DOUBLE FILTER - Backend + Frontend
      const userInternalResults = allResults.filter(
        (r) =>
          r.studentId &&
          String(r.studentId._id) === String(loggedUser._id) &&
          r.type === "internal" && // 🔥 EXTRA SAFETY
          r.published === true     // 🔥 EXTRA SAFETY
      );

      if (userInternalResults.length === 0) {
        setError("No published internal results found");
        setResults([]);
        setLoading(false);
        return;
      }

      setResults(userInternalResults);
      setError("");
    } catch (err) {
      console.error("Internal fetch error:", err);
      setError("Server error while fetching internal results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternalResults();
  }, [loggedUser]);

  // ================= LIST VIEW =================
  if (!selectedResult) {
    return (
      <Card className="p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>📚 Internal Exam Results</h4>
          <Button variant="outline-primary" onClick={fetchInternalResults}>
            🔄 Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" />
            <p className="mt-2">Loading internal results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              📭 No published internal results found
            </p>
            <small className="text-muted">
              Ask admin to publish your internal results
            </small>
          </div>
        ) : (
          <Table bordered className="text-center" responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Semester</th>
                <th>Course</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const total = r.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0) || 0;
                const max = r.subjects?.reduce((sum, s) => sum + (s.maxMarks || 0), 0) || 0;
                const percent = max > 0 ? ((total / max) * 100).toFixed(2) : "0.00";
                const status = checkPassFail(r.subjects);

                return (
                  <tr key={r._id} className={status === "Fail" ? "table-danger" : ""}>
                    <td><strong>{i + 1}</strong></td>
                    <td>{r.Sem || r.sem || "N/A"}</td>
                    <td>{r.course || "N/A"}</td>
                    <td><strong>{total}/{max}</strong></td>
                    <td>
                      <span className={percent < 33 ? "text-danger" : "text-success"}>
                        {percent}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge fs-6 px-3 py-2 ${
                        status === "Pass" ? "bg-success" : "bg-danger"
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => setSelectedResult(r)}
                      >
                        👁️ View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    );
  }

  // ================= FULL RESULT VIEW =================
  const totalMarks = selectedResult.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0) || 0;
  const maxMarks = selectedResult.subjects?.reduce((sum, s) => sum + (s.maxMarks || 0), 0) || 0;
  const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";
  const finalStatus = checkPassFail(selectedResult.subjects);

  return (
    <Card className="p-4 shadow-lg border-primary">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-primary mb-1">📚 Internal Exam Result</h3>
          <p className="mb-0 text-muted">
            <strong>Semester:</strong> {selectedResult.Sem || selectedResult.sem || "N/A"} | 
            <strong> Course:</strong> {selectedResult.course || "N/A"}
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setSelectedResult(null)}
        >
          ← Back to List
        </Button>
      </div>

      {/* Student Info */}
      <div className="row mb-4 p-3 bg-light rounded">
        <div className="col-md-4">
          <strong>Name:</strong> {selectedResult.studentId?.name || "N/A"}
        </div>
        <div className="col-md-4">
          <strong>Enrollment:</strong> {selectedResult.studentId?.EnrollmentNo || "N/A"}
        </div>
        <div className="col-md-4">
          <strong>Department:</strong> {selectedResult.department || "N/A"}
        </div>
      </div>

      {/* Subjects Table */}
      <Table bordered className="text-center mb-4" responsive>
        <thead className="table-primary">
          <tr>
            <th>Subject</th>
            <th>Obtained Marks</th>
            <th>Max Marks</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedResult.subjects?.map((s, i) => {
            const subPercent = s.maxMarks > 0 ? ((s.marks / s.maxMarks) * 100).toFixed(1) : "0.0";
            const subStatus = (s.marks / s.maxMarks) >= 0.33 ? "Pass" : "Fail";
            
            return (
              <tr key={i} className={subStatus === "Fail" ? "table-danger" : ""}>
                <td><strong>{s.name}</strong></td>
                <td>{s.marks || 0}</td>
                <td>{s.maxMarks || 0}</td>
                <td>{subPercent}%</td>
                <td>
                  <span className={`badge fs-6 px-3 py-2 ${
                    subStatus === "Pass" ? "bg-success" : "bg-danger"
                  }`}>
                    {subStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Summary */}
      <div className="row text-center p-4 bg-gradient border rounded" 
           style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="col-md-3">
          <h5><strong>Total:</strong></h5>
          <h3 className="text-primary">{totalMarks}/{maxMarks}</h3>
        </div>
        <div className="col-md-3">
          <h5><strong>Percentage:</strong></h5>
          <h3 className={percentage >= 33 ? "text-success" : "text-danger"}>
            {percentage}%
          </h3>
        </div>
        <div className="col-md-3">
          <h5><strong>Status:</strong></h5>
          <h3 className={`fw-bold ${finalStatus === "Pass" ? "text-success" : "text-danger"}`}>
            {finalStatus}
          </h3>
        </div>
        <div className="col-md-3 d-flex align-items-center justify-content-center">
          <Button 
            variant="outline-primary" 
            size="lg"
            onClick={fetchInternalResults}
          >
            🔄 Refresh Results
          </Button>
        </div>
      </div>
    </Card>
  );
}
