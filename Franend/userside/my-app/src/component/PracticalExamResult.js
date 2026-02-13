import React, { useEffect, useState } from "react";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const API = "http://localhost:3000/api/results";
const PRACTICAL_API = `${API}/published?type=practical`;

// ================= PASS/FAIL LOGIC =================
const checkPassFail = (subjects) => {
  if (!subjects || subjects.length === 0) return "N/A";

  const failed = subjects.some((s) => {
    const ratio = (s.marks || 0) / (s.maxMarks || 1); // avoid divide by 0
    return ratio < 0.33;
  });

  return failed ? "Fail" : "Pass";
};

export default function PracticalExamResult({ loggedUser, setError }) {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH PRACTICAL RESULTS ONLY =================
  const fetchPracticalResults = async () => {
    if (!loggedUser?._id) return;
    setLoading(true);
    try {
      // 🔥 FIXED: SIRF PRACTICAL + PUBLISHED + STUDENT MATCH
      const res = await axios.get(PRACTICAL_API);
      const allResults = res.data.data || [];

      // DOUBLE FILTER - Backend + Frontend
      const userResults = allResults.filter(
        (r) =>
          r.studentId &&
          String(r.studentId._id) === String(loggedUser._id) &&
          r.type === "practical" && // 🔥 EXTRA SAFETY
          r.published === true     // 🔥 EXTRA SAFETY
      );

      if (userResults.length === 0) {
        setError("No published practical results found");
        setResults([]);
        setLoading(false);
        return;
      }

      setResults(userResults);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Server error while fetching practical results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticalResults();
  }, [loggedUser]);

  // ================= LIST VIEW =================
  if (!selectedResult) {
    return (
      <Card className="p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>🔧 Practical Exam Results</h4>
          <Button variant="outline-primary" onClick={fetchPracticalResults}>
            🔄 Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" />
            <p className="mt-2">Loading practical results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              📭 No published practical results found
            </p>
            <small className="text-muted">
              Ask admin to publish your practical results
            </small>
          </div>
        ) : (
          <Table bordered className="text-center" responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Semester</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const total = r.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0) || 0;
                const max = r.subjects?.reduce((sum, s) => sum + (s.maxMarks || 50), 0) || 0;
                const percent = max > 0 ? ((total / max) * 100).toFixed(2) : "0.00";
                const status = checkPassFail(r.subjects);

                return (
                  <tr key={r._id} className={status === "Fail" ? "table-danger" : ""}>
                    <td><strong>{i + 1}</strong></td>
                    <td>{r.Sem || r.sem || r.semester || r.semesterNo || "N/A"}</td>
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
  const maxMarks = selectedResult.subjects?.reduce((sum, s) => sum + (s.maxMarks || 50), 0) || 0;
  const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";
  const finalStatus = checkPassFail(selectedResult.subjects);

  return (
    <Card className="p-4 shadow-lg border-warning">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-warning mb-1">🔧 Practical Exam Result</h3>
          <p className="mb-0 text-muted">
            <strong>Semester:</strong> {selectedResult.Sem || selectedResult.sem || selectedResult.semester || "N/A"}
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
        <thead className="table-warning">
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
                <td>{s.marks}</td>
                <td>{s.maxMarks}</td>
                <td>
                  <span className={subPercent < 33 ? "text-danger" : "text-success"}>
                    {subPercent}%
                  </span>
                </td>
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

      {/* Summary Section */}
      <Card className="bg-light p-3 mb-3">
        <div className="row">
          <div className="col-md-3 text-center">
            <p className="text-muted mb-1">Total Marks</p>
            <h5 className="text-dark mb-0">{totalMarks}/{maxMarks}</h5>
          </div>
          <div className="col-md-3 text-center">
            <p className="text-muted mb-1">Percentage</p>
            <h5 className={`mb-0 ${percentage < 33 ? "text-danger" : "text-success"}`}>
              {percentage}%
            </h5>
          </div>
          <div className="col-md-3 text-center">
            <p className="text-muted mb-1">Final Status</p>
            <span className={`badge fs-5 px-3 py-2 ${
              finalStatus === "Pass" ? "bg-success" : "bg-danger"
            }`}>
              {finalStatus}
            </span>
          </div>
          <div className="col-md-3 text-center">
            <p className="text-muted mb-1">Result Date</p>
            <p className="text-dark mb-0 small">
              {selectedResult.resultDate 
                ? new Date(selectedResult.resultDate).toLocaleDateString('en-IN')
                : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      <Button variant="secondary" onClick={() => setSelectedResult(null)}>
        ← Back to List
      </Button>
    </Card>
  );
}
