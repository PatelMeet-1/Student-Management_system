import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FinalResultManager() {
  const RESULTS_API = "http://localhost:3000/api/results";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewResult, setViewResult] = useState(null);
  const printRef = useRef(); // Ref for print

  // ================= LOAD RESULTS =================
  const loadResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(RESULTS_API);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      const grouped = {};
      data.forEach((r) => {
        const key = `${r.studentId?._id}_${r.Sem}`;
        if (!grouped[key]) {
          grouped[key] = {
            _id: r._id,
            student: r.studentId || {},
            Sem: r.Sem,
            course: r.course,
            department: r.department,
            internalSubjects: [],
            practicalSubjects: [],
            universitySubjects: [],
            totalMarks: 0,
            totalMaxMarks: 0,
          };
        }
        (r.subjects || []).forEach((s) => {
          const subjectWithType = { ...s, type: r.type };
          if (r.type === "internal") grouped[key].internalSubjects.push(subjectWithType);
          if (r.type === "practical") grouped[key].practicalSubjects.push(subjectWithType);
          if (r.type === "university") grouped[key].universitySubjects.push(subjectWithType);

          grouped[key].totalMarks += s.marks || 0;
          grouped[key].totalMaxMarks += s.maxMarks || 0;
        });
      });

      setResults(Object.values(grouped));
      toast.success("✅ Results Loaded");
    } catch (err) {
      toast.error("❌ Load failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  // ================= CALCULATE RESULT =================
  const calculateResult = (result) => {
    const subjects = [
      ...result.internalSubjects,
      ...result.practicalSubjects,
      ...result.universitySubjects,
    ];

    const subjectsWithGrades = subjects.map((s) => {
      const marks = s.marks || 0;
      const maxMarks = s.maxMarks || 100;
      const percent = (marks / maxMarks) * 100;

      let grade = "F";
      if (percent >= 90) grade = "A+";
      else if (percent >= 80) grade = "A";
      else if (percent >= 70) grade = "B+";
      else if (percent >= 60) grade = "B";
      else if (percent >= 50) grade = "C+";
      else if (percent >= 40) grade = "C";
      else if (percent >= 33) grade = "D";
      else grade = "F";

      return { ...s, percentage: percent.toFixed(2), grade };
    });

    const status = subjectsWithGrades.some((s) => s.percentage < 33) ? "FAIL" : "PASS";

    const gradePointMap = { "A+":10, "A":9, "B+":8, "B":7, "C+":6, "C":5, "D":4, "F":0 };
    const spi = subjectsWithGrades.length
      ? (subjectsWithGrades.reduce((sum, s) => sum + gradePointMap[s.grade],0)/subjectsWithGrades.length).toFixed(2)
      : 0;

    const totalMarks = subjectsWithGrades.reduce((sum, s) => sum + (s.marks || 0),0);
    const totalMax = subjectsWithGrades.reduce((sum, s) => sum + (s.maxMarks || 100),0);
    const percentage = totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : 0;

    return { subjects: subjectsWithGrades, spi, status, totalMarks, totalMax, percentage };
  };

  // ================= PRINT =================
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore page
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <h5 className="mt-3">Loading Results...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <ToastContainer />
      <h3 className="text-center mb-4 text-primary">🎓 Final Result Manager</h3>

      {/* ================= RESULTS TABLE ================= */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5>📋 Results</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Sem</th>
                <th>Course</th>
                <th>Department</th>
                <th>Total Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{r.student?.name}</td>
                  <td>{r.student?.EnrollmentNo}</td>
                  <td>{r.Sem}</td>
                  <td>{r.course}</td>
                  <td>{r.department}</td>
                  <td>{r.totalMarks}/{r.totalMaxMarks}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => setViewResult(r)}>
                      👁️ View Result
                    </button>
                    <button className="btn btn-warning btn-sm ms-2" onClick={handlePrint}>
                      🖨️ Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= VIEW RESULT CARD ================= */}
      {viewResult && (
        <div ref={printRef} className="card mt-4 border-success shadow-lg p-3">
          <div className="text-center mb-3">
            <h3>🏆 SEMESTER RESULT - {viewResult.Sem}</h3>
            <h5>{viewResult.student?.name} | {viewResult.course} | {viewResult.department}</h5>
            <small>Enrollment: {viewResult.student?.EnrollmentNo}</small>
          </div>

          {/* ================= RESULT SUMMARY ================= */}
          {(() => {
            const calc = calculateResult(viewResult);
            return (
              <div className="row mb-4 p-3 bg-light rounded">
                <div className="col-md-3">
                  <h6>Total Marks</h6>
                  <h4>{calc.totalMarks}/{calc.totalMax}</h4>
                </div>
                <div className="col-md-3">
                  <h6>Percentage</h6>
                  <h4>{calc.percentage}%</h4>
                </div>
                <div className="col-md-3">
                  <h6>SPI</h6>
                  <h4 className={calc.status==='PASS'?'text-success':'text-danger'}>{calc.spi}</h4>
                </div>
                <div className="col-md-3">
                  <h6>Status</h6>
                  <span className={`badge w-100 p-2 ${calc.status==='PASS'?'bg-success':'bg-danger'}`}>{calc.status}</span>
                </div>
              </div>
            )
          })()}

          {/* ================= SUBJECTS TABLE ================= */}
          {["internalSubjects","practicalSubjects","universitySubjects"].map((key) => {
            const subjects = viewResult[key] || [];
            if (!subjects.length) return null;
            const calc = calculateResult(viewResult);

            return (
              <div key={key} className="mb-4">
                <h5 className="text-uppercase border-bottom pb-2">{key.replace("Subjects","")}</h5>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Obtained</th>
                        <th>%</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calc.subjects
                        .filter(s => s.type === key.replace("Subjects","").toLowerCase())
                        .map((s,i)=>(
                          <tr key={i} className={s.percentage<33?"table-danger":""}>
                            <td>{s.name}</td>
                            <td>{s.maxMarks}</td>
                            <td>{s.marks}</td>
                            <td>{s.percentage}%</td>
                            <td>{s.grade}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          <div className="mt-4 p-3 bg-success bg-gradient rounded text-center text-white">
            <h4>{calculateResult(viewResult).status==='PASS'?'🎉 PASS':'⚠️ FAIL'}</h4>
            <p className="mb-0 fs-6">
              SPI: <strong>{calculateResult(viewResult).spi}</strong> | 
              Percentage: <strong>{calculateResult(viewResult).percentage}%</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
