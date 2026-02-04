import React, { useEffect, useState } from "react";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const API = "http://localhost:3000/api/results";
const PRACTICAL_API = `${API}?type=practical`;

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

  // ================= FETCH PRACTICAL RESULTS =================
  const fetchPracticalResults = async () => {
    if (!loggedUser?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(PRACTICAL_API);
      const allResults = res.data.data || [];

      // Filter only logged-in student's practical results
      const userResults = allResults.filter(
        (r) =>
          r.studentId &&
          String(r.studentId._id) === String(loggedUser._id)
      );

      if (userResults.length === 0) {
        setError("No practical result found");
        setResults([]);
        setLoading(false);
        return;
      }

      setResults(userResults);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Server error while fetching results");
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
          <h4>Practical Exam Results</h4>
          <Button onClick={fetchPracticalResults}>Refresh Result</Button>
        </div>

        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-muted">
            Click "Refresh Result" to view your practical exam result
          </p>
        ) : (
          <Table bordered className="text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Semester</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const total = r.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0) || 0;
                const max = r.subjects?.reduce((sum, s) => sum + (s.maxMarks || 50), 0) || 0; // default 50 if missing
                const percent = max > 0 ? ((total / max) * 100).toFixed(2) : "0.00";
                const status = checkPassFail(r.subjects);

                return (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>{r.Sem || r.sem || r.semester || r.semesterNo || "N/A"}</td>
                    <td>{total}/{max}</td>
                    <td>{percent}%</td>
                    <td>{status}</td>
                    <td>
                      <Button size="sm" onClick={() => setSelectedResult(r)}>
                        View
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
    <Card className="p-4 shadow">
      <h4 className="text-center mb-3">PRACTICAL EXAM RESULT</h4>

      <p><b>Name:</b> {selectedResult.studentId?.name || "N/A"}</p>
      <p><b>Enrollment No:</b> {selectedResult.studentId?.EnrollmentNo || "N/A"}</p>
      <p><b>Semester:</b> {selectedResult.Sem || selectedResult.sem || selectedResult.semester || "N/A"}</p>

      <Table bordered className="text-center mt-3">
        <thead className="table-dark">
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Max Marks</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedResult.subjects?.map((s, i) => {
            const subStatus = (s.marks / s.maxMarks) >= 0.33 ? "Pass" : "Fail";
            return (
              <tr key={i} style={{ color: subStatus === "Fail" ? "red" : "black" }}>
                <td>{s.name}</td>
                <td>{s.marks}</td>
                <td>{s.maxMarks}</td>
                <td>{subStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <p><b>Total:</b> {totalMarks}/{maxMarks}</p>
      <p><b>Percentage:</b> {percentage}%</p>
      <p><b>Final Status:</b> {finalStatus}</p>

      <Button variant="secondary" onClick={() => setSelectedResult(null)}>
        Back
      </Button>
    </Card>
  );
}
