import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const RESULTS_API = "http://localhost:3000/api/results";

// ================= GRADE SYSTEM =================
const calculateGrade = (percent) => {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C+";
  if (percent >= 40) return "C";
  if (percent >= 33) return "D";
  return "F";
};

// ================= PASS/FAIL LOGIC =================
const checkPassFail = (subjects) => {
  return subjects.some((s) => ((s.marks || 0) / (s.maxMarks || 1)) < 0.33) ? "FAIL" : "PASS";
};

export default function FinalResultTable({ loggedUser }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSemester, setExpandedSemester] = useState(null);

  // ================= FETCH ONLY PUBLISHED RESULTS =================
  useEffect(() => {
    if (!loggedUser?._id) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        // 🔥 FIXED: SIRF PUBLISHED RESULTS
        const res = await axios.get(`${RESULTS_API}/published`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        // Only logged-in student's PUBLISHED results
        const userResults = data.filter(
          (r) => 
            r.studentId && 
            String(r.studentId._id) === String(loggedUser._id) &&
            r.published === true  // 🔥 PUBLISHED CHECK
        );

        // Group results by semester
        const grouped = {};
        userResults.forEach((r) => {
          const key = r.Sem || "Unknown";
          if (!grouped[key]) {
            grouped[key] = {
              Sem: key,
              internalSubjects: [],
              practicalSubjects: [],
              universitySubjects: [],
              course: r.course,
              department: r.department,
              student: r.studentId,
            };
          }

          (r.subjects || []).forEach((s) => {
            const subjectWithType = { ...s, type: r.type };
            if (r.type === "internal") grouped[key].internalSubjects.push(subjectWithType);
            if (r.type === "practical") grouped[key].practicalSubjects.push(subjectWithType);
            if (r.type === "university") grouped[key].universitySubjects.push(subjectWithType);
          });
        });

        setResults(Object.values(grouped));
        toast.success("✅ Results loaded");
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [loggedUser]);

  // ================= CALCULATE SEMESTER =================
  const calculateSemester = (semester) => {
    const subjects = [
      ...semester.internalSubjects,
      ...semester.practicalSubjects,
      ...semester.universitySubjects,
    ];

    const subjectsWithGrades = subjects.map((s) => {
      const marks = s.marks || 0;
      const maxMarks = s.maxMarks || 100;
      const percent = (marks / maxMarks) * 100;
      const grade = calculateGrade(percent);
      return { ...s, percentage: percent.toFixed(2), grade };
    });

    const status = checkPassFail(subjectsWithGrades);
    const gradePointMap = { "A+":10, "A":9, "B+":8, "B":7, "C+":6, "C":5, "D":4, "F":0 };
    const spi = subjectsWithGrades.length
      ? (subjectsWithGrades.reduce((sum, s) => sum + gradePointMap[s.grade], 0) / subjectsWithGrades.length).toFixed(2)
      : 0;
    const totalMarks = subjectsWithGrades.reduce((sum, s) => sum + (s.marks || 0), 0);
    const totalMax = subjectsWithGrades.reduce((sum, s) => sum + (s.maxMarks || 100), 0);
    const percentage = totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : 0;

    return { subjects: subjectsWithGrades, totalMarks, totalMax, percentage, spi, status };
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading your results...</p>
      </div>
    );

  if (!results.length)
    return (
      <Card className="p-5 text-center shadow">
        <h5 className="text-muted mb-2">📭 No Results Available</h5>
        <p className="text-muted mb-0">Your results have not been published yet. Check back later!</p>
      </Card>
    );

  return (
    <div className="container-fluid">
      <Card className="p-4 shadow mb-4 border-primary">
        <h3 className="text-primary mb-3">🎓 Your University Results</h3>
        
        {/* Student Info Header */}
        <div className="row p-3 bg-light rounded mb-4">
          <div className="col-md-3 mb-2 mb-md-0">
            <p className="text-muted mb-1">Student Name</p>
            <p className="fw-bold">{loggedUser.name || "N/A"}</p>
          </div>
          <div className="col-md-3 mb-2 mb-md-0">
            <p className="text-muted mb-1">Enrollment No</p>
            <p className="fw-bold">{loggedUser.EnrollmentNo || "N/A"}</p>
          </div>
          <div className="col-md-3 mb-2 mb-md-0">
            <p className="text-muted mb-1">Course</p>
            <p className="fw-bold">{loggedUser.course || "N/A"}</p>
          </div>
          <div className="col-md-3">
            <p className="text-muted mb-1">Department</p>
            <p className="fw-bold">{loggedUser.department || "N/A"}</p>
          </div>
        </div>
      </Card>

      {results.map((sem, idx) => {
        const calc = calculateSemester(sem);
        const isExpanded = expandedSemester === sem.Sem;

        return (
          <Card key={idx} className="mb-3 p-4 shadow border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-secondary mb-0">📚 Semester {sem.Sem}</h5>
              <Button
                size="sm"
                variant={isExpanded ? "primary" : "outline-primary"}
                onClick={() => setExpandedSemester(isExpanded ? null : sem.Sem)}
              >
                {isExpanded ? "📖 Hide Details" : "👁️ View Details"}
              </Button>
            </div>

            {/* Summary Row */}
            <div className="row p-2 bg-light rounded mb-3">
              <div className="col-6 col-md-3 mb-2 mb-md-0 text-center">
                <p className="text-muted small mb-1">Total Marks</p>
                <h6 className="mb-0">{calc.totalMarks}/{calc.totalMax}</h6>
              </div>
              <div className="col-6 col-md-3 mb-2 mb-md-0 text-center">
                <p className="text-muted small mb-1">Percentage</p>
                <h6 className={`mb-0 ${calc.percentage >= 33 ? "text-success" : "text-danger"}`}>
                  {calc.percentage}%
                </h6>
              </div>
              <div className="col-6 col-md-3 mb-2 mb-md-0 text-center">
                <p className="text-muted small mb-1">SPI</p>
                <h6 className="mb-0">{calc.spi}</h6>
              </div>
              <div className="col-6 col-md-3 text-center">
                <p className="text-muted small mb-1">Status</p>
                <span className={`badge fs-6 px-3 py-2 ${calc.status === "PASS" ? "bg-success" : "bg-danger"}`}>
                  {calc.status}
                </span>
              </div>
            </div>

            {isExpanded && (
              <>
                {["internalSubjects","practicalSubjects","universitySubjects"].map((key) => {
                  const subjects = sem[key];
                  if (!subjects.length) return null;

                  const typeLabel = key.replace("Subjects","").toUpperCase();
                  const typeEmoji = key.includes("internal") ? "📋" : key.includes("practical") ? "🔧" : "🎓";

                  return (
                    <div key={key} className="mb-4">
                      <h6 className="text-primary fw-bold mb-3">{typeEmoji} {typeLabel} EXAM</h6>
                      <Table bordered className="text-center mb-3" responsive>
                        <thead className="table-primary">
                          <tr>
                            <th>Subject</th>
                            <th>Max Marks</th>
                            <th>Obtained</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calc.subjects
                            .filter(s => s.type === key.replace("Subjects","").toLowerCase())
                            .map((s, i) => (
                              <tr key={i} className={s.percentage < 33 ? "table-danger" : ""}>
                                <td className="text-start fw-bold">{s.name}</td>
                                <td>{s.maxMarks}</td>
                                <td>{s.marks}</td>
                                <td>
                                  <span className={s.percentage < 33 ? "text-danger" : "text-success"}>
                                    {s.percentage}%
                                  </span>
                                </td>
                                <td>
                                  <span className="badge bg-info text-dark">{s.grade}</span>
                                </td>
                                <td>
                                  <span className={`badge fs-6 px-2 py-1 ${s.percentage < 33 ? "bg-danger" : "bg-success"}`}>
                                    {s.percentage < 33 ? "FAIL" : "PASS"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                })}

                {/* Combined Result Summary */}
                <Card className="p-4 bg-gradient border-info">
                  <h5 className="text-center text-info mb-3">📊 Combined Semester Result</h5>
                  <div className="row">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                      <p className="text-muted small mb-1">Total Marks</p>
                      <h6 className="fw-bold text-dark">{calc.totalMarks}/{calc.totalMax}</h6>
                    </div>
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                      <p className="text-muted small mb-1">Percentage</p>
                      <h6 className={`fw-bold ${calc.percentage >= 33 ? "text-success" : "text-danger"}`}>
                        {calc.percentage}%
                      </h6>
                    </div>
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                      <p className="text-muted small mb-1">SPI (Grade Point)</p>
                      <h6 className="fw-bold text-dark">{calc.spi}/10</h6>
                    </div>
                    <div className="col-md-3 text-center">
                      <p className="text-muted small mb-1">Final Status</p>
                      <span className={`badge fs-5 px-3 py-2 ${calc.status === "PASS" ? "bg-success" : "bg-danger"}`}>
                        {calc.status}
                      </span>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
