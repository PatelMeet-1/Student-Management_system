import React, { useState } from "react";
import { Card, Button, Table } from "react-bootstrap";

export default function StudentResult({ loggedUser, setError }) {
  const [result, setResult] = useState(null);

  const fetchResult = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      const student = data.find(u => u._id === loggedUser._id);
      if (!student) return setError("Result not found");
      setResult(student);
    } catch {
      setError("Server error");
    }
  };

  const handlePrint = () => {
    const content = document.getElementById("printResult").innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`<html><head><title>Result</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
    </head><body onload="window.print(); window.close();">${content}</body></html>`);
    win.document.close();
  };

  const totalMarks = result ? result.results.reduce((sum, r) => sum + r.marks, 0) : 0;
  const maxMarks = result ? result.results.length * 100 : 0;
  const percentage = maxMarks ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;
  const status = percentage >= 33 ? "PASS" : "FAIL";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Student Result</h4>
        <Button onClick={fetchResult}>Refresh Result</Button>
      </div>

      {result ? (
        <div id="printResult">
          <Card className="p-4 shadow">
            <h4 className="text-center mb-3">STUDENT RESULT</h4>
            <div className="text-center mb-3">
              {result.photo && <img src={`http://localhost:3000${result.photo}`} alt="Student" style={{ width: 120, height: 120, borderRadius: "50%" }} />}
            </div>
            <p><b>Name:</b> {result.name}</p>
            <p><b>Roll No:</b> {result.rollNo}</p>
            <p><b>Standard:</b> {result.std}</p>

            <Table bordered className="text-center">
              <thead className="table-dark">
                <tr><th>Subject</th><th>Marks</th></tr>
              </thead>
              <tbody>
                {result.results && result.results.map((r, i) => (
                  <tr key={i}><td>{r.subject}</td><td>{r.marks}</td></tr>
                ))}
              </tbody>
            </Table>

            <p><b>Total:</b> {totalMarks}/{maxMarks}</p>
            <p><b>Percentage:</b> {percentage}%</p>
            <h5 className={`text-center ${status === "PASS" ? "text-success" : "text-danger"}`}>
              RESULT: {status}
            </h5>
          </Card>
          <Button className="mt-3" onClick={handlePrint}>Print Result</Button>
        </div>
      ) : (
        <Card className="p-4 shadow text-center">
          <p>Click "Refresh Result" to view your result</p>
        </Card>
      )}
    </>
  );
}
