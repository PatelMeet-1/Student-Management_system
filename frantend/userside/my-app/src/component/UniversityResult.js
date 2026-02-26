import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

// ================= PASS / FAIL =================
const checkPassFail = (subjects) =>
  subjects.some((s) => s.percentage < 33) ? "FAIL" : "PASS";

// ================= DATE FORMAT =================
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN");
};

export default function FinalResultTable({ loggedUser }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSemester, setExpandedSemester] = useState(null);

  const RESULTS_API = process.env.REACT_APP_API_URL;

  // ================= FETCH RESULTS =================
  useEffect(() => {
    if (!loggedUser?._id) return;

    const fetchResults = async () => {
      try {
        const res = await axios.get(`${RESULTS_API}/results/published`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        const userResults = data.filter(
          (r) =>
            r.studentId &&
            String(r.studentId._id) === String(loggedUser._id) &&
            r.published === true
        );

        const grouped = {};
        userResults.forEach((r) => {
          const key = r.Sem;
          if (!grouped[key]) {
            grouped[key] = {
              Sem: key,
              internalSubjects: [],
              practicalSubjects: [],
              universitySubjects: [],
              student: r.studentId,
              course: r.course,
              department: r.department,
              resultDate: r.createdAt, // ✅ use createdAt
            };
          }

          (r.subjects || []).forEach((s) => {
            grouped[key][`${r.type}Subjects`].push({
              ...s,
              type: r.type,
            });
          });
        });

        setResults(Object.values(grouped));
        toast.success("✅ Results loaded");
      } catch (err) {
        toast.error("❌ Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [loggedUser, RESULTS_API]);

  // ================= CALCULATIONS =================
  const calculateSemester = (sem) => {
    const subjects = [
      ...sem.internalSubjects,
      ...sem.practicalSubjects,
      ...sem.universitySubjects,
    ].map((s) => {
      const percentage = ((s.marks / s.maxMarks) * 100).toFixed(2);
      return {
        ...s,
        percentage: Number(percentage),
        grade: calculateGrade(percentage),
      };
    });

    const gradeMap = { "A+": 10, A: 9, "B+": 8, B: 7, "C+": 6, C: 5, D: 4, F: 0 };
    const spi = (
      subjects.reduce((sum, s) => sum + gradeMap[s.grade], 0) /
      subjects.length
    ).toFixed(2);

    const totalMarks = subjects.reduce((s, x) => s + x.marks, 0);
    const totalMax = subjects.reduce((s, x) => s + x.maxMarks, 0);
    const percentage = ((totalMarks / totalMax) * 100).toFixed(2);
    const status = checkPassFail(subjects);

    return { subjects, totalMarks, totalMax, percentage, spi, status };
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
        <p className="text-muted mb-0">
          Your results have not been published yet. Check back later!
        </p>
      </Card>
    );

  return (
    <div className="container-fluid">
      {/* ===== ONLY TITLE (NO STUDENT INFO) ===== */}
      <Card className="p-4 shadow mb-4">
        <h3 className="text-primary">🎓 Your University Results</h3>
      </Card>

     {results
  .filter((sem) => sem.universitySubjects && sem.universitySubjects.length > 0) // ✅ show only if university result exists
  .map((sem, idx) => {
    const calc = calculateSemester(sem);
    const isExpanded = expandedSemester === sem.Sem;

    return (
      <Card key={idx} className="mb-3 p-4 shadow border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">📚 Semester {sem.Sem}</h5>
              <Button
                size="sm"
                variant={isExpanded ? "primary" : "outline-primary"}
                onClick={() =>
                  setExpandedSemester(isExpanded ? null : sem.Sem)
                }
              >
                {isExpanded ? "Hide Details" : "View Details"}
              </Button>
            </div>
  {isExpanded && (
              <>
                {/* ===== PRINTABLE CONTENT ===== */}
                <div id={`print-sem-${sem.Sem}`}>
            {/* ===== SUMMARY ROW ===== */}
            <div className="row p-2 bg-light rounded mb-3 text-center">
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Total Marks</p>
                <h6>
                  {calc.totalMarks}/{calc.totalMax}
                </h6>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Percentage</p>
                <h6>{calc.percentage}%</h6>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">SPI</p>
                <h6>{calc.spi}</h6>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Result Date</p>
                <h6>{formatDate(sem.resultDate)}</h6>
              </div>
            </div>

          
                  {/* ===== STUDENT INFO TABLE ===== */}
                  <Table bordered className="mb-4">
                    <tbody>
                      <tr>
                        <th>Student Name</th>
                        <td>{sem.student?.name}</td>
                      </tr>
                      <tr>
                        <th>Semester</th>
                        <td>{sem.Sem}</td>
                      </tr>
                      <tr>
                        <th>Enrollment No</th>
                        <td>{sem.student?.EnrollmentNo}</td>
                      </tr>
                      <tr>
                        <th>Course</th>
                        <td>{sem.course}</td>
                      </tr>
                      <tr>
                        <th>Department</th>
                        <td>{sem.department}</td>
                      </tr>
                    </tbody>
                  </Table>

                  {/* ===== SUBJECT TABLES ===== */}
                  {["internalSubjects", "practicalSubjects", "universitySubjects"].map(
                    (key) => {
                      const subjects = sem[key];
                      if (!subjects.length) return null;

                      return (
                        <Table
                          key={key}
                          bordered
                          responsive
                          className="text-center mb-4"
                        >
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
                              .filter(
                                (s) =>
                                  s.type ===
                                  key.replace("Subjects", "").toLowerCase()
                              )
                              .map((s, i) => (
                                <tr key={i}>
                                  <td className="text-start">{s.name}</td>
                                  <td>{s.maxMarks}</td>
                                  <td>{s.marks}</td>
                                  <td>{s.percentage}%</td>
                                  <td>{s.grade}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        s.percentage < 33
                                          ? "bg-danger"
                                          : "bg-success"
                                      }`}
                                    >
                                      {s.percentage < 33 ? "FAIL" : "PASS"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      );
                    }
                  )}
                </div>

                {/* ===== PRINT BUTTON ===== */}
                <div className="text-center my-3">
                  <Button
                    variant="success"
                    onClick={() => {
                      const printContents = document.getElementById(
                        `print-sem-${sem.Sem}`
                      ).innerHTML;
                      const originalContents = document.body.innerHTML;
                      document.body.innerHTML = printContents;
                      window.print();
                      document.body.innerHTML = originalContents;
                      window.location.reload();
                    }}
                  >
                    🖨️ Print Result
                  </Button>
                </div>
              </>
            )}
          </Card>
        );
      })}
      <ToastContainer />
    </div>
  );
}