import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FilterComponent from '../Final result/Filter'; // 🔥 NEW IMPORT

// 🔥 REUSABLE MARKS MANAGER COMPONENT
export default function MarksManager({
  type, // "university" | "practical" | "internal"
  title,
  apiBase, // e.g., "/api/results", "/api/practical", "/api/internal"
  usersApi = "/api/users",
  coursesApi = "/api/courses",
  examTypeLabel = "Exam Type"
}) {
  const API = apiBase;
  const USERS_API = usersApi;
  const COURSES_API = coursesApi;

  // ---------------- STATES ----------------
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [excelRows, setExcelRows] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  
  // 🔥 NEW FILTER STATES FOR FilterComponent
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showTopPerformers, setShowTopPerformers] = useState(false);
  const [topLimit, setTopLimit] = useState(10);
  const [showFailedStudents, setShowFailedStudents] = useState(false);
  
  const [viewResult, setViewResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSubjects, setEditingSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", marks: "" });
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🔥 Get unique semesters / courses / departments
  const getUniqueSemesters = () => {
    return [...new Set(results.map(r => r.Sem).filter(Boolean))].sort();
  };

  const getUniqueCourses = () => {
    return [...new Set(results.map(r => r.course).filter(Boolean))].sort();
  };

  const getUniqueDepartments = () => {
    return [...new Set(results.map(r => r.department).filter(Boolean))].sort();
  };

  // 🔥 HELPER FUNCTIONS FOR FILTERING
  const calculateStatus = (subjects) => {
    if (!subjects?.length) return "No Subjects";
    const hasFail = subjects.some(
      (s) => ((s.marks || 0) / (s.maxMarks || 1)) * 100 < 33
    );
    return hasFail ? "❌ FAIL" : "✅ PASS";
  };

  const getPercentage = (result) => {
    const totalMarks = result.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0) || 0;
    const totalMax = result.subjects?.reduce((sum, s) => sum + (s.maxMarks || 100), 0) || 100;
    return totalMax ? (totalMarks / totalMax) * 100 : 0;
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    loadInitialData();
  }, []);

  // 🔥 POWERFUL FILTER LOGIC
  const filterResults = useCallback(() => {
    let filtered = results;
    
    // 🔥 SEMESTER / COURSE / DEPARTMENT FILTER
    if (semesterFilter) {
      filtered = filtered.filter(r => r.Sem === semesterFilter);
    }
    if (courseFilter) {
      filtered = filtered.filter(r => (r.course || "").toString() === courseFilter);
    }
    if (departmentFilter) {
      filtered = filtered.filter(r => (r.department || "").toString() === departmentFilter);
    }

    // 🔥 SEARCH FILTER
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((r) => {
        const enrollmentMatch = r.enrollmentNo && 
          r.enrollmentNo.toLowerCase().includes(query);
        const courseMatch = r.course && 
          r.course.toLowerCase().includes(query);
        const departmentMatch = r.department && 
          r.department.toLowerCase().includes(query);
        const semMatch = r.Sem && 
          r.Sem.toLowerCase().includes(query);
        return enrollmentMatch || courseMatch || departmentMatch || semMatch;
      });
    }

    // 🔥 TOP PERFORMERS FILTER
    if (showTopPerformers) {
      filtered = filtered
        .filter(r => calculateStatus(r.subjects) === "✅ PASS")
        .sort((a, b) => getPercentage(b) - getPercentage(a))
        .slice(0, topLimit);
    }

    // 🔥 FAILED STUDENTS FILTER
    if (showFailedStudents) {
      filtered = filtered
        .filter(r => calculateStatus(r.subjects) === "❌ FAIL")
        .sort((a, b) => getPercentage(a) - getPercentage(b));
    }

    setFilteredResults(filtered);
  }, [results, searchTerm, semesterFilter, courseFilter, departmentFilter, showTopPerformers, showFailedStudents, topLimit, refreshTrigger]);

  useEffect(() => {
    filterResults();
  }, [filterResults]);

  // 🔥 FILTER HANDLERS FOR FilterComponent
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSemesterFilter = (e) => setSemesterFilter(e.target.value);
  const handleCourseFilter = (e) => setCourseFilter(e.target.value);
  const handleDepartmentFilter = (e) => setDepartmentFilter(e.target.value);
  const handleTopLimitChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0 && value <= 100) setTopLimit(value);
  };
  const toggleTopPerformers = () => {
    setShowTopPerformers(!showTopPerformers);
    if (!showTopPerformers) {
      setShowFailedStudents(false);
      setSearchTerm("");
      setSemesterFilter("");
      setCourseFilter("");
      setDepartmentFilter("");
    }
  };
  const toggleFailedStudents = () => {
    setShowFailedStudents(!showFailedStudents);
    if (!showFailedStudents) {
      setShowTopPerformers(false);
      setSearchTerm("");
      setSemesterFilter("");
      setCourseFilter("");
      setDepartmentFilter("");
    }
  };
  const clearAllFilters = () => {
    setSearchTerm("");
    setSemesterFilter("");
    setCourseFilter("");
    setDepartmentFilter("");
    setShowTopPerformers(false);
    setShowFailedStudents(false);
    setTopLimit(10);
  };

  // ---------------- LOAD DATA ----------------
  const loadInitialData = async () => {
    try {
      await Promise.all([loadStudents(), loadCourses(), loadResults()]);
    } catch (err) {
      console.error("Initial load error:", err);
    }
  };

  const loadResults = async () => {
    try {
      const res = await axios.get(`${API}?type=${type}`);
      const data =
        res.data.success && Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

      const processed = data.map((r) => ({
        ...r,
        enrollmentNo:
          r.studentId?.EnrollmentNo || r.enrollmentNo || r.studentId || "-",
        course: r.course || "-",
        department: r.department || "-",
        Sem: r.Sem || "-",
        published: r.published || false,
      }));

      setResults(processed);
    } catch (err) {
      console.error("Load results error:", err);
      toast.error("Failed to load results");
    }
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get(USERS_API);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Students error:", err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await axios.get(COURSES_API);
      const data =
        res.data.success && Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
      setCourses(data);
    } catch (err) {
      console.error("Courses error:", err);
    }
  };

  // 🔥 PUBLISH/UNPUBLISH FUNCTION
  const togglePublish = async (resultId) => {
    try {
      setLoading(true);
      const res = await axios.patch(`${API}/${resultId}/publish`);
      toast.success(
        `✅ ${
          res.data.published ? "PUBLISHED" : "UNPUBLISHED"
        }: ${resultId.slice(-6)}`
      );
      setRefreshTrigger(prev => prev + 1);
      loadResults();
    } catch (err) {
      console.error("❌ Publish error:", err.response?.data || err.message);
      toast.error("❌ Publish failed!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUBJECTS ----------------
  useEffect(() => {
    if (selectedCourse && selectedDepartment && selectedSemester) {
      const course = courses.find((c) => c.courseName === selectedCourse);
      if (course?.departments) {
        const dept = course.departments.find(
          (d) => d.departmentName === selectedDepartment
        );
        if (dept?.semesters) {
          const sem = dept.semesters.find(
            (s) => s.semesterName === selectedSemester
          );
          if (sem?.subjects) {
            setSubjects(
              sem.subjects.map((s) => ({
                name: s.subjectName || s.name,
                maxMarks: s[`${type}Total`] || s.maxMarks || 70,
              }))
            );
            return;
          }
        }
      }
    }
    setSubjects([]);
  }, [selectedCourse, selectedDepartment, selectedSemester, courses, type]);

  // ✅ MARKS VALIDATION FUNCTION
  const validateMarks = (marks, maxMarks) => {
    const numMarks = Number(marks);
    if (isNaN(numMarks) || numMarks < 0) {
      return { valid: false, message: "Marks must be 0 or positive" };
    }
    if (numMarks > maxMarks) {
      return { valid: false, message: `Marks cannot exceed ${maxMarks}` };
    }
    return { valid: true };
  };

  // ---------------- EXCEL UPLOAD ----------------
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: "",
          blankrows: false,
        });
        const rows = data.slice(1).filter((row) => row[0]);
        setExcelRows(rows);
        toast.success(`✅ Excel loaded: ${rows.length} rows`);
        e.target.value = "";
      } catch (error) {
        toast.error("❌ Invalid Excel file!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ VALIDATED EXCEL SUBMIT
  const submitExcel = async () => {
    if (!excelRows.length) return toast.error("No rows to upload");
    if (!selectedCourse || !selectedDepartment || !selectedSemester) {
      return toast.error("Select Course → Department → Semester first");
    }
    if (!subjects.length) return toast.error("No subjects for selected semester");

    setLoading(true);
    let uploaded = 0, skipped = 0, errors = 0, validationErrors = 0;

    try {
      const existingRes = await axios.get(`${API}?type=${type}`);
      const existingData =
        existingRes.data.success && Array.isArray(existingRes.data.data)
          ? existingRes.data.data
          : Array.isArray(existingRes.data)
          ? existingRes.data
          : [];

      let localResults = [...existingData];

      for (let i = 0; i < excelRows.length; i++) {
        try {
          const row = excelRows[i];
          const enrollment = String(row[0] || "").trim();
          if (!enrollment) {
            skipped++;
            continue;
          }

          const student = students.find(
            (s) =>
              String(s.EnrollmentNo || s.enrollmentNo || "").trim() ===
              enrollment
          );

          if (!student) {
            skipped++;
            continue;
          }

          // ✅ COURSE/DEPT VERIFICATION
          const studentCourse = String(
            student.course || student.Course || ""
          ).trim();
          const studentDept = String(
            student.department || student.Department || ""
          ).trim();

          if (
            !studentCourse ||
            !studentDept ||
            studentCourse.toLowerCase() !== selectedCourse.toLowerCase() ||
            studentDept.toLowerCase() !== selectedDepartment.toLowerCase()
          ) {
            skipped++;
            continue;
          }

          // ✅ MARKS VALIDATION FOR ALL SUBJECTS
          const subjectsData = subjects.map((sub, idx) => {
            const marks = Number(row[idx + 4]) || 0;
            const validation = validateMarks(marks, sub.maxMarks);
            
            if (!validation.valid) {
              validationErrors++;
              toast.error(`Row ${i + 1}, ${sub.name}: ${validation.message}`);
              throw new Error("Marks validation failed");
            }
            
            return {
              name: sub.name,
              marks,
              maxMarks: sub.maxMarks,
            };
          });

          const baseSem = String(row[3] || selectedSemester).trim();
          let uniqueSem = baseSem;
          let count = 1;

          const duplicates = localResults.filter(
            (r) =>
              String(r.studentId) === String(student._id) &&
              r.course === selectedCourse &&
              r.department === selectedDepartment
          );

          while (duplicates.some((r) => r.Sem === uniqueSem)) {
            uniqueSem = `${baseSem} Remedial ${count++}`;
          }

          await axios.post(API, {
            studentId: student._id,
            course: selectedCourse,
            department: selectedDepartment,
            Sem: uniqueSem,
            type: type,
            subjects: subjectsData,
            published: false,
          });

          uploaded++;
          localResults.push({ 
            data: { 
              data: { Sem: uniqueSem, studentId: student._id, published: false }
            } 
          });
        } catch (err) {
          if (err.message === "Marks validation failed") {
            validationErrors++;
            continue;
          }
          errors++;
          console.error("Row upload error:", err);
        }
      }
    } catch (e) {
      errors++;
      console.error("Submit Excel error:", e);
    }

    const message = `✅ ${uploaded} uploaded (${type.toUpperCase()}) | ${skipped} skipped | ${validationErrors} validation errors | ${errors} errors`;
    toast.success(message);
    setExcelRows([]);
    setLoading(false);
    loadResults();
  };

  // ---------------- CRUD OPERATIONS ----------------
  const loadResultDetails = async (resultId) => {
    try {
      const res = await axios.get(`${API}/${resultId}`);
      setEditingSubjects((res.data.data || res.data).subjects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarksChange = (index, newMarks) => {
    const validation = validateMarks(newMarks, editingSubjects[index].maxMarks);
    const newSubs = [...editingSubjects];
    newSubs[index].marks = Number(newMarks) || 0;
    
    setEditingSubjects(newSubs);
    
    if (!validation.valid) {
      toast.error(`❌ ${editingSubjects[index].name}: ${validation.message}`);
    }
  };

  const updateSubject = async (resultId, index) => {
    try {
      await axios.put(`${API}/${resultId}`, { subjects: editingSubjects });
      toast.success("✅ Updated!");
      loadResultDetails(resultId);
    } catch (err) {
      toast.error("❌ Update failed");
    }
  };

  const deleteSubject = async (resultId, index) => {
    if (!window.confirm("Delete subject?")) return;
    try {
      const newSubs = editingSubjects.filter((_, i) => i !== index);
      await axios.put(`${API}/${resultId}`, { subjects: newSubs });
      setEditingSubjects(newSubs);
      toast.success("✅ Deleted!");
      loadResults();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  const addSubject = async () => {
    if (!newSubject.name.trim() || !viewResult?._id) return;
    
    const validation = validateMarks(newSubject.marks, 70);
    if (!validation.valid) {
      toast.error(`❌ New Subject: ${validation.message}`);
      return;
    }
    
    try {
      setLoading(true);
      const newSub = {
        name: newSubject.name.trim(),
        marks: Number(newSubject.marks) || 0,
        maxMarks: 70,
      };
      const updated = [...editingSubjects, newSub];
      await axios.put(`${API}/${viewResult._id}`, { subjects: updated });
      setEditingSubjects(updated);
      setNewSubject({ name: "", marks: "" });
      toast.success("✅ Added!");
      loadResultDetails(viewResult._id);
    } catch (err) {
      toast.error("❌ Add failed");
    } finally {
      setLoading(false);
    }
  };

  const saveAllChanges = async () => {
    try {
      await axios.put(`${API}/${viewResult._id}`, { subjects: editingSubjects });
      toast.success("✅ Saved all!");
      setEditMode(false);
      loadResults();
    } catch (err) {
      toast.error("❌ Save failed");
    }
  };

  const deleteResult = async (id) => {
    if (!window.confirm("Delete entire result?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("✅ Deleted!");
      if (viewResult?._id === id) {
        setViewResult(null);
        setEditingSubjects([]);
      }
      loadResults();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  const handleViewEdit = async (result) => {
    try {
      setViewResult(result);
      setEditMode(false);
      await loadResultDetails(result._id);
    } catch (err) {
      toast.error("Failed to load");
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3 className="text-center mb-4">
        {title || `${type.charAt(0).toUpperCase() + type.slice(1)} Marks Manager`}
      </h3>

      {/* Course Selection */}
      <div className="card p-3 mb-4">
        <h5>📋 Course/Department/Semester</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedDepartment("");
                setSelectedSemester("");
              }}
            >
              <option value="">📚 Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c.courseName}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedDepartment}
              disabled={!selectedCourse}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedSemester("");
              }}
            >
              <option value="">🏢 Select Department</option>
              {selectedCourse &&
                courses.map(
                  (c) =>
                    c.courseName === selectedCourse &&
                    c.departments?.map((d) => (
                      <option key={d._id} value={d.departmentName}>
                        {d.departmentName}
                      </option>
                    ))
                )}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedSemester}
              disabled={!selectedDepartment}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">📅 Select Semester</option>
              {selectedDepartment &&
                courses.map(
                  (c) =>
                    c.courseName === selectedCourse &&
                    c.departments?.map(
                      (d) =>
                        d.departmentName === selectedDepartment &&
                        d.semesters?.map((s) => (
                          <option key={s._id} value={s.semesterName}>
                            {s.semesterName}
                          </option>
                        ))
                    )
                )}
            </select>
          </div>
        </div>
        {subjects.length > 0 && (
          <div className="alert alert-success mt-2">
            📚 Subjects: {subjects.map((s) => s.name).join(", ")}
            <span className="badge bg-warning ms-2">33% Pass</span>
          </div>
        )}
      </div>

      {/* Excel Upload */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>📤 Excel Upload ({type})</h5>
        <div className="row g-2">
          <div className="col-md-8">
            <input
              type="file"
              onChange={handleExcelUpload}
              accept=".xlsx,.xls"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-success w-100"
              onClick={submitExcel}
              disabled={!subjects.length || !excelRows.length || loading}
            >
              {loading ? "⏳ Uploading..." : `🚀 Upload ${excelRows.length} rows`}
            </button>
          </div>
        </div>
        {excelRows.length > 0 && (
          <details className="mt-3">
            <summary>📋 Preview ({excelRows.length} rows)</summary>
            <pre
              className="small bg-light p-2 rounded mt-2"
              style={{ maxHeight: "150px", overflow: "auto" }}
            >
              {JSON.stringify(excelRows.slice(0, 2), null, 2)}
            </pre>
          </details>
        )}
      </div>

      

      {/* RESULTS TABLE - SIMPLIFIED HEADER */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
    
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
                <th>Enrollment</th>
                <th>Course</th>
                <th>Dept</th>
                <th>Sem</th>
                <th>Status</th>
                <th>Published</th>
                <th>Subjects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    {searchTerm || semesterFilter || showTopPerformers || showFailedStudents
                      ? `❌ No results found`
                      : "📭 No results found"}
                  </td>
                </tr>
              ) : (
                filteredResults.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td><strong>{r.enrollmentNo}</strong></td>
                    <td>{r.course}</td>
                    <td>{r.department}</td>
                    <td>{r.Sem}</td>
                    <td>
                      <span
                        className={`badge fs-6 px-3 py-2 ${
                          calculateStatus(r.subjects) === "✅ PASS"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {calculateStatus(r.subjects)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge fs-6 px-3 py-2 ${
                          r.published 
                            ? "bg-success" 
                            : "bg-warning text-dark"
                        }`}
                      >
                        {r.published ? "✅ Published" : "⏳ Draft"}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {r.subjects?.length || 0}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-success btn-sm me-1"
                          onClick={() => togglePublish(r._id)}
                          disabled={loading}
                          title={r.published ? "Unpublish" : "Publish"}
                        >
                          {r.published ? "📤 Unpublish" : "📤 Publish"}
                        </button>
                        <button
                          className="btn btn-info btn-sm me-1"
                          onClick={() => handleViewEdit(r)}
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteResult(r._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Panel */}
      {viewResult && (
        <div className="card mt-4 shadow-lg border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5>
              📄 {viewResult.enrollmentNo} - {viewResult.Sem}
              
              
            </h5>
            <div>
              {editMode && (
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={saveAllChanges}
                >
                  💾 Save
                </button>
              )}
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setViewResult(null);
                  setEditMode(false);
                  setEditingSubjects([]);
                }}
              >
                ❌ Close
              </button>
            </div>
          </div>
          
          <div className="card-body">
            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-3">
                <strong>Course:</strong> {viewResult.course}
              </div>
              <div className="col-md-3">
                <strong>Dept:</strong> {viewResult.department}
              </div>
              <div className="col-md-2">
                <strong>Sem:</strong> {viewResult.Sem}
              </div>
              <div className="col-md-2">
                <strong>Subjects:</strong> {editingSubjects.length}
              </div>
              <div className="col-md-2">
                <strong>Status:</strong> {calculateStatus(editingSubjects)}
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className={editMode ? "table-warning" : "table-primary"}>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Max</th>
                    <th>%</th>
                    <th>Grade</th>
                    {editMode && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {editingSubjects.map((s, i) => (
                    <tr key={i}>
                      <td>{s.name}</td>
                      <td>
                        {editMode ? (
                          <input
                            className={`form-control form-control-sm ${
                              s.marks > s.maxMarks ? "is-invalid" : ""
                            }`}
                            type="number"
                            min="0"
                            max={s.maxMarks}
                            value={s.marks || ""}
                            onChange={(e) => handleMarksChange(i, e.target.value)}
                            title={`Max: ${s.maxMarks}`}
                          />
                        ) : (
                          <strong>{s.marks}/{s.maxMarks}</strong>
                        )}
                      </td>
                      <td><strong>{s.maxMarks}</strong></td>
                      <td>{((s.marks / s.maxMarks) * 100).toFixed(1)}%</td>
                      <td>
                        <span
                          className={`badge px-2 py-1 ${
                            (s.marks / s.maxMarks) * 100 >= 33
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {(s.marks / s.maxMarks) * 100 >= 33 ? "Pass" : "Fail"}
                        </span>
                      </td>
                      {editMode && (
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => updateSubject(viewResult._id, i)}
                              disabled={s.marks > s.maxMarks}
                            >
                              💾
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteSubject(viewResult._id, i)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-3">
              <button
                className={`btn btn-lg ${
                  editMode ? "btn-secondary" : "btn-primary"
                } me-2`}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "👁️ View" : "✏️ Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
