import React, { useEffect, useState } from "react";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const API = process.env.REACT_APP_API_URL + "/results";
const PRACTICAL_API = `${API}/published?type=practical`;

// ================= PASS / FAIL =================
const checkPassFail = (subjects) => {
  if (!subjects || subjects.length === 0) return "N/A";
  return subjects.some(
    (s) => (s.marks || 0) / (s.maxMarks || 1) < 0.33
  )
    ? "Fail"
    : "Pass";
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

export default function PracticalExamResult({ loggedUser, setError }) {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPracticalResults = async () => {
    if (!loggedUser?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(PRACTICAL_API);
      const data = res.data.data || [];

      const filtered = data.filter(
        (r) =>
          r.studentId &&
          String(r.studentId._id) === String(loggedUser._id) &&
          r.type === "practical" &&
          r.published === true
      );

      setResults(filtered);
      setError("");
    } catch (err) {
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
        <div className="d-flex justify-content-between mb-3">
          <h4>🔧 Practical Exam Results</h4>
          {/* <Button onClick={fetchPracticalResults}>🔄 Refresh</Button> */}
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-muted">
            No published practical results
          </p>
        ) : (
          <Table bordered responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Semester</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Result Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const total =
                  r.subjects?.reduce((s, x) => s + (x.marks || 0), 0) || 0;
                const max =
                  r.subjects?.reduce(
                    (s, x) => s + (x.maxMarks || 50),
                    0
                  ) || 0;
                const percent =
                  max > 0 ? ((total / max) * 100).toFixed(2) : "0.00";
                const status = checkPassFail(r.subjects);

                return (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>{r.sem || r.Sem || "N/A"}</td>
                    <td>
                      {total}/{max}
                    </td>
                    <td>{percent}%</td>
                    <td>
                      {formatDate(
                        r.declaredAt ||
                          r.publishedAt ||
                          r.resultDate ||
                          r.createdAt
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          status === "Pass"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      <Button
                        size="sm"
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

  // ================= DETAIL VIEW (SAME AS INTERNAL) =================
  const totalMarks =
    selectedResult.subjects?.reduce(
      (s, x) => s + (x.marks || 0),
      0
    ) || 0;

  const maxMarks =
    selectedResult.subjects?.reduce(
      (s, x) => s + (x.maxMarks || 50),
      0
    ) || 0;

  const percentage =
    maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";

  const finalStatus = checkPassFail(selectedResult.subjects);

  return (
    <Card className="p-4 shadow-lg border-primary">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h3 className="text-primary mb-1">
            🔧 Practical Exam Result
          </h3>
          <p className="text-muted mb-0">
            <strong>Semester:</strong>{" "}
            {selectedResult.sem || selectedResult.Sem || "N/A"}
          </p>
        </div>
        <Button onClick={() => setSelectedResult(null)}>
          ← Back to List
        </Button>
      </div>

      {/* STUDENT INFO */}
      <div className="row mb-4 p-3 bg-light rounded">
        <div className="col-md-4">
          <strong>Name:</strong>{" "}
          {selectedResult.studentId?.name}
        </div>
        <div className="col-md-4">
          <strong>Enrollment:</strong>{" "}
          {selectedResult.studentId?.EnrollmentNo}
        </div>
        <div className="col-md-4">
          <strong>Department:</strong>{" "}
          {selectedResult.department || "N/A"}
        </div>
      </div>

      {/* SUBJECT TABLE */}
      <Table bordered responsive className="text-center mb-4">
        <thead className="table-primary">
          <tr>
            <th>Subject</th>
            <th>Obtained</th>
            <th>Max</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedResult.subjects?.map((s, i) => {
            const subPer =
              s.maxMarks > 0
                ? ((s.marks / s.maxMarks) * 100).toFixed(1)
                : "0.0";
            const subStatus =
              s.marks / s.maxMarks >= 0.33 ? "Pass" : "Fail";

            return (
              <tr
                key={i}
                className={subStatus === "Fail" ? "table-danger" : ""}
              >
                <td>{s.name}</td>
                <td>{s.marks}</td>
                <td>{s.maxMarks}</td>
                <td>{subPer}%</td>
                <td>
                  <span
                    className={`badge ${
                      subStatus === "Pass"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {subStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* SUMMARY */}
      <div className="row text-center p-4 bg-light rounded">
        <div className="col-md-3">
          <h6>Total</h6>
          <h5>
            {totalMarks}/{maxMarks}
          </h5>
        </div>
        <div className="col-md-3">
          <h6>Percentage</h6>
          <h5
            className={
              percentage < 33 ? "text-danger" : "text-success"
            }
          >
            {percentage}%
          </h5>
        </div>
        <div className="col-md-3">
          <h6>Status</h6>
          <h5
            className={
              finalStatus === "Pass"
                ? "text-success"
                : "text-danger"
            }
          >
            {finalStatus}
          </h5>
        </div>
        <div className="col-md-3">
          <h6>Result Date</h6>
          <h5>
            {formatDate(
              selectedResult.declaredAt ||
                selectedResult.publishedAt ||
                selectedResult.resultDate ||
                selectedResult.createdAt
            )}
          </h5>
        </div>
      </div>
    </Card>
  );
}