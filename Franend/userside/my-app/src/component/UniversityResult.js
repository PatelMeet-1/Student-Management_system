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

  // ================= FETCH RESULTS =================
  useEffect(() => {
    if (!loggedUser?._id) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(RESULTS_API);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        // Only logged-in student's results
        const userResults = data.filter(
          (r) => r.studentId && String(r.studentId._id) === String(loggedUser._id)
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

    const status = checkPassFail(subjectsWithGrades); // FAIL if any subject <33%
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
        <p>Loading your results...</p>
      </div>
    );

  if (!results.length)
    return (
      <div className="text-center mt-5">
        <p>No results available for you.</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3 className="text-center mb-4">🎓 Your Semester Results</h3>
      <p>
        <b>Name:</b> {loggedUser.name} | <b>Enrollment:</b> {loggedUser.EnrollmentNo}
      </p>
      <p>
        <b>Course:</b> {loggedUser.course} | <b>Department:</b> {loggedUser.department}
      </p>

      {results.map((sem, idx) => {
        const calc = calculateSemester(sem);
        const isExpanded = expandedSemester === sem.Sem;

        return (
          <Card key={idx} className="mb-3 p-3 shadow">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Semester: {sem.Sem}</h5>
              <Button
                size="sm"
                onClick={() => setExpandedSemester(isExpanded ? null : sem.Sem)}
              >
                {isExpanded ? "Hide" : "View"}
              </Button>
            </div>

            {isExpanded && (
              <>
                {["internalSubjects","practicalSubjects","universitySubjects"].map((key) => {
                  const subjects = sem[key];
                  if (!subjects.length) return null;

                  return (
                    <div key={key} className="mb-3">
                      <h6 className="text-primary text-uppercase">{key.replace("Subjects","")}</h6>
                      <Table bordered className="text-center">
                        <thead className="table-dark">
                          <tr>
                            <th>Subject</th>
                            <th>Max Marks</th>
                            <th>Obtained</th>
                            <th>%</th>
                            <th>Grade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calc.subjects
                            .filter(s => s.type === key.replace("Subjects","").toLowerCase())
                            .map((s, i) => (
                              <tr key={i} className={s.percentage < 33 ? "table-danger" : ""}>
                                <td>{s.name}</td>
                                <td>{s.maxMarks}</td>
                                <td>{s.marks}</td>
                                <td>{s.percentage}%</td>
                                <td>{s.grade}</td>
                                <td className={s.percentage < 33 ? "text-danger" : "text-success"}>
                                  {s.percentage < 33 ? "FAIL" : "PASS"}
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                })}

                <Card className="p-2 border-info">
                  <h6 className="text-center">Combined Semester Result</h6>
                  <p><b>Total Marks:</b> {calc.totalMarks}/{calc.totalMax}</p>
                  <p><b>Percentage:</b> {calc.percentage}%</p>
                  <p><b>SPI:</b> {calc.spi}</p>
                  <h6 className={`text-center ${calc.status==="PASS"?"text-success":"text-danger"}`}>
                    FINAL STATUS: {calc.status}
                  </h6>
                </Card>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
