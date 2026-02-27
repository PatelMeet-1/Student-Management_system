import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Card, Button, Table } from "react-bootstrap";  // ✅ REQUIRED FOR JSX
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FilterComponent from "./Filter"; // 🔥 NEW IMPORT

export default function FinalResultManager() {
  const RESULTS_API = `${process.env.REACT_APP_API_URL}/results`;
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewResult, setViewResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showTopPerformers, setShowTopPerformers] = useState(false);
  const [topLimit, setTopLimit] = useState(10);
  const [showFailedStudents, setShowFailedStudents] = useState(false);
  const printRef = useRef(null);

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
          if (r.type === "internal")
            grouped[key].internalSubjects.push(subjectWithType);
          if (r.type === "practical")
            grouped[key].practicalSubjects.push(subjectWithType);
          if (r.type === "university")
            grouped[key].universitySubjects.push(subjectWithType);

          grouped[key].totalMarks += s.marks || 0;
          grouped[key].totalMaxMarks += s.maxMarks || 0;
        });
      });

      const processedResults = Object.values(grouped);
      setResults(processedResults);
      setFilteredResults(processedResults);
      toast.success("✅ Results Loaded");
    } catch (err) {
      toast.error("❌ Load failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CALCULATE STATUS FOR TABLE
  const calculateTableStatus = (result) => {
    const allSubjects = [
      ...result.internalSubjects,
      ...result.practicalSubjects,
      ...result.universitySubjects,
    ];
    const hasFail = allSubjects.some(
      (s) => ((s.marks || 0) / (s.maxMarks || 1)) * 100 < 33,
    );
    return hasFail ? "❌ FAIL" : "✅ PASS";
  };

  // 🔥 Get percentage for sorting
  const getPercentage = (result) => {
    return (result.totalMarks / result.totalMaxMarks) * 100;
  };

  // 🔥 Get all unique semesters
  const getUniqueSemesters = () => {
    return [...new Set(results.map((r) => r.Sem).filter(Boolean))].sort();
  };

  const getUniqueCourses = () => {
    return [...new Set(results.map((r) => r.course).filter(Boolean))].sort();
  };

  const getUniqueDepartments = () => {
    return [
      ...new Set(results.map((r) => r.department).filter(Boolean)),
    ].sort();
  };

  // ================= FILTER & SEARCH =================
  const filterResults = useCallback(() => {
    let filtered = results;

    // 🔥 SEMESTER / COURSE / DEPARTMENT FILTER
    if (semesterFilter) {
      filtered = filtered.filter((r) => r.Sem === semesterFilter);
    }
    if (courseFilter) {
      filtered = filtered.filter(
        (r) => (r.course || "").toString() === courseFilter,
      );
    }
    if (departmentFilter) {
      filtered = filtered.filter(
        (r) => (r.department || "").toString() === departmentFilter,
      );
    }

    // 🔥 SEARCH FILTER
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((r) => {
        return (
          (r.Sem && r.Sem.toString().toLowerCase().includes(lowerTerm)) ||
          (r.student?.EnrollmentNo &&
            r.student.EnrollmentNo.toLowerCase().includes(lowerTerm)) ||
          (r.student?.name &&
            r.student.name.toLowerCase().includes(lowerTerm)) ||
          (r.course && r.course.toLowerCase().includes(lowerTerm)) ||
          (r.department && r.department.toLowerCase().includes(lowerTerm))
        );
      });
    }

    // 🔥 TOP PERFORMERS FILTER - Sort by percentage DESC & take top LIMIT
    if (showTopPerformers) {
      filtered = filtered
        .filter((r) => calculateTableStatus(r) === "✅ PASS")
        .sort((a, b) => getPercentage(b) - getPercentage(a))
        .slice(0, topLimit);
    }

    // 🔥 FAILED STUDENTS FILTER
    if (showFailedStudents) {
      filtered = filtered
        .filter((r) => calculateTableStatus(r) === "❌ FAIL")
        .sort((a, b) => getPercentage(a) - getPercentage(b));
    }

    setFilteredResults(filtered);
  }, [
    results,
    searchTerm,
    semesterFilter,
    courseFilter,
    departmentFilter,
    showTopPerformers,
    showFailedStudents,
    topLimit,
  ]);

  // 🔥 FILTER HANDLERS FOR FilterComponent
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSemesterFilter = (e) => {
    setSemesterFilter(e.target.value);
  };
  const handleCourseFilter = (e) => {
  setCourseFilter(e.target.value);
};

const handleDepartmentFilter = (e) => {
  setDepartmentFilter(e.target.value);
};


  const handleTopLimitChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0 && value <= 100) {
      setTopLimit(value);
    }
  };

  const toggleTopPerformers = () => {
    setShowTopPerformers(!showTopPerformers);
    if (!showTopPerformers) {
      setShowFailedStudents(false);
      setSearchTerm("");
      setSemesterFilter("");
    }
  };

  const toggleFailedStudents = () => {
    setShowFailedStudents(!showFailedStudents);
    if (!showFailedStudents) {
      setShowTopPerformers(false);
      setSearchTerm("");
      setSemesterFilter("");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSemesterFilter("");
    setShowTopPerformers(false);
    setShowFailedStudents(false);
    setTopLimit(10);
  };

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [filterResults]);

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

    const status = subjectsWithGrades.some((s) => s.percentage < 33)
      ? "FAIL"
      : "PASS";

    const gradePointMap = {
      "A+": 10,
      A: 9,
      "B+": 8,
      B: 7,
      "C+": 6,
      C: 5,
      D: 4,
      F: 0,
    };
    const spi = subjectsWithGrades.length
      ? (
          subjectsWithGrades.reduce(
            (sum, s) => sum + gradePointMap[s.grade],
            0,
          ) / subjectsWithGrades.length
        ).toFixed(2)
      : 0;

    const totalMarks = subjectsWithGrades.reduce(
      (sum, s) => sum + (s.marks || 0),
      0,
    );
    const totalMax = subjectsWithGrades.reduce(
      (sum, s) => sum + (s.maxMarks || 100),
      0,
    );
    const percentage = totalMax
      ? ((totalMarks / totalMax) * 100).toFixed(2)
      : 0;

    return {
      subjects: subjectsWithGrades,
      spi,
      status,
      totalMarks,
      totalMax,
      percentage,
    };
  };

  const handlePrint = useCallback(() => {
    if (printRef.current) {
      window.print();
    }
  }, []);

  const closeResult = () => {
    setViewResult(null);
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

      {/* RESULTS TABLE */}
      <div className="card shadow ">
        <div className="card-header bg-primary text-white p-3">
          {/* 🔥 FILTER COMPONENT - FULLY REPLACED */}
          <FilterComponent
  searchTerm={searchTerm}
  semesterFilter={semesterFilter}
  courseFilter={courseFilter}
  departmentFilter={departmentFilter}
  showTopPerformers={showTopPerformers}
  showFailedStudents={showFailedStudents}
  topLimit={topLimit}

  uniqueSemesters={getUniqueSemesters()}
  uniqueCourses={getUniqueCourses()}
  uniqueDepartments={getUniqueDepartments()}

  filteredCount={filteredResults.length}
  totalFilteredCount={results.length}

  onSearchChange={handleSearch}
  onSemesterChange={handleSemesterFilter}
  onCourseChange={handleCourseFilter}
  onDepartmentChange={handleDepartmentFilter}
  onTopLimitChange={handleTopLimitChange}
  onToggleTopPerformers={toggleTopPerformers}
  onToggleFailedStudents={toggleFailedStudents}
  onClearFilters={clearAllFilters}
/>

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
                <th>Percentage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    {searchTerm ||
                    semesterFilter ||
                    showTopPerformers ||
                    showFailedStudents
                      ? `❌ No results found`
                      : "📭 No results found"}
                  </td>
                </tr>
              ) : (
                filteredResults.map((r, i) => (
                  <tr
                    key={r._id}
                    className={
                      calculateTableStatus(r) === "❌ FAIL"
                        ? "table-danger"
                        : ""
                    }
                  >
                    <td>{i + 1}</td>
                    <td>{r.student?.name}</td>
                    <td>{r.student?.EnrollmentNo}</td>
                    <td>{r.Sem}</td>
                    <td>{r.course}</td>
                    <td>{r.department}</td>
                    <td>
                      <strong
                        className={
                          getPercentage(r) >= 70
                            ? "text-success"
                            : getPercentage(r) >= 50
                              ? "text-warning"
                              : "text-danger"
                        }
                      >
                        {getPercentage(r).toFixed(1)}%
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`badge fs-6 px-3 py-2 ${
                          calculateTableStatus(r) === "✅ PASS"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {calculateTableStatus(r)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => setViewResult(r)}
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW RESULT PANEL */}
 {/* 🔥 EXACT SAME RESULT FORMAT - View Button Panel */}
{viewResult && (
  <div ref={printRef} className="mt-5">
    <style jsx>{`
      @media print {
        body * { visibility: hidden; }
        .print-section, .print-section * { visibility: visible; }
        .print-section { 
          position: absolute; left: 0; top: 0; width: 100%; 
          background: white !important; 
        }
        .no-print { display: none !important; }
        .card { box-shadow: none !important; border: 2px solid #28a745 !important; }
      }
    `}</style>

    <Card className="shadow-lg border-primary p-0 print-section no-print-on-top">
      {/* Header Buttons */}
      {/* <div className="position-relative">
        <button
          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3 z-3 no-print"
          onClick={closeResult}
          style={{ borderRadius: "50%", width: "40px", height: "30px" }}
        >
          ✕
        </button>
        <button 
          className="btn btn-warning btn-sm position-absolute top-0 start-0 m-3 z-3 no-print"
          onClick={handlePrint}
        >
          🖨️ Print
        </button>
      </div> */}

      {/* MAIN RESULT CARD - EXACT SAME FORMAT */}
      <Card className="p-4 shadow-lg border-primary print-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="text-primary mb-1">🎓 Final Semester Result</h3>
            <p className="mb-0 text-muted">
              <strong>Semester:</strong> {viewResult.Sem || "N/A"} | 
              <strong> Course:</strong> {viewResult.course || "N/A"}
            </p>
          </div>
          <Button 
            variant="danger" 
            onClick={closeResult}
            className="no-print mb-5"
          >
            X
          </Button>
        </div>

        {/* Student Info */}
        <div className="row mb-4 p-3 bg-light rounded">
          <div className="col-md-4">
            <strong>Name:</strong> {viewResult.student?.name || "N/A"}
          </div>
          <div className="col-md-4">
            <strong>Enrollment:</strong> {viewResult.student?.EnrollmentNo || "N/A"}
          </div>
          <div className="col-md-4">
            <strong>Department:</strong> {viewResult.department || "N/A"}
          </div>
        </div>

        {/* Summary Section - EXACT FORMAT */}
        {/* {(() => {
          const calc = calculateResult(viewResult);
          return (
            <div className="row text-center p-4 bg-gradient border rounded mb-4" 
                 style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
              <div className="col-md-3">
                <h5><strong>Total:</strong></h5>
                <h3 className="text-primary">{calc.totalMarks}/{calc.totalMax}</h3>
              </div>
              <div className="col-md-3">
                <h5><strong>Percentage:</strong></h5>
                <h3 className={calc.percentage >= 33 ? "text-success" : "text-danger"}>
                  {calc.percentage}%
                </h3>
              </div>
              <div className="col-md-3">
                <h5><strong>SPI:</strong></h5>
                <h3 className={`fw-bold ${calc.status === "PASS" ? "text-success" : "text-danger"}`}>
                  {calc.spi}
                </h3>
              </div>
              <div className="col-md-3">
                <h5><strong>Status:</strong></h5>
                <h3 className={`fw-bold ${calc.status === "PASS" ? "text-success" : "text-danger"}`}>
                  {calc.status}
                </h3>
              </div>
            </div>
          );
        })()} */}

        {/* Subjects Tables - EXACT SAME FORMAT */}
        {["internalSubjects", "practicalSubjects", "universitySubjects"].map((key) => {
          const subjects = viewResult[key] || [];
          if (!subjects.length) return null;
          
          const calc = calculateResult(viewResult);
          const typeName = key.replace("Subjects", "").toUpperCase();

          return (
            <div key={key} className="mb-4">
              <h5 className="text-primary border-bottom pb-2 mb-3">
                📚 {typeName} Subjects ({subjects.length})
              </h5>
              
              <Table bordered className="text-center mb-0" responsive>
                <thead className="table-primary">
                  <tr>
                    <th>Subject</th>
                    <th>Obtained Marks</th>
                    <th>Max Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.subjects
                    .filter((s) => s.type === key.replace("Subjects", "").toLowerCase())
                    .map((s, i) => {
                      const subStatus = s.percentage >= 33 ? "PASS" : "FAIL";
                      return (
                        <tr key={i} className={subStatus === "FAIL" ? "table-danger" : ""}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.marks || 0}</td>
                          <td>{s.maxMarks || 0}</td>
                          <td>
                            <span className={s.percentage >= 50 ? "text-success" : "text-danger"}>
                              {s.percentage}%
                            </span>
                          </td>
                          <td>
                            <span className={`badge fs-6 px-3 py-2 ${
                              s.grade === "F" ? "bg-danger" : "bg-success"
                            }`}>
                              {s.grade}
                            </span>
                          </td>
                          <td>
                            <span className={`badge fs-6 px-3 py-2 ${
                              subStatus === "PASS" ? "bg-success" : "bg-danger"
                            }`}>
                              {subStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          );
        })}

        {/* Final Status Summary */}
        {(() => {
          const calc = calculateResult(viewResult);
          return (
            <div className="row text-center p-4 bg-gradient border rounded mt-4" 
                 style={{ 
                   background: calc.status === "PASS" 
                     ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' 
                     : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)'
                 }}>
              <div className="col-12">
                <h3 className={`fw-bold mb-3 ${
                  calc.status === "PASS" ? "text-success" : "text-danger"
                }`}>
                  {calc.status === "PASS" ? "🎉 PASS" : "⚠️ FAIL"}
                </h3>
                <h5 className="text-muted">
                  SPI: <strong>{calc.spi}</strong> | 
                  Percentage: <strong>{calc.percentage}%</strong> | 
                  Total Marks: <strong>{calc.totalMarks}/{calc.totalMax}</strong>
                </h5>
              </div>
            </div>
          );
        })()}
      </Card>
    </Card>
  </div>
)}


    </div>
  );
}
