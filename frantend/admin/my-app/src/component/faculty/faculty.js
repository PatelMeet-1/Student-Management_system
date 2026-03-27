import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UnifiedSearchFilter from "./filter1";

export default function Faculty() {
  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courseDepartments, setCourseDepartments] = useState({}); // Course-wise departments
  const [faculties, setFaculties] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseMap, setCourseMap] = useState({});
  const [departmentMap, setDepartmentMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(""); // Track selected course

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    contact: "",
    email: "",
    course: "",
    department: "", // ✅ NEW: Department field
    password: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    fetchCourses();
    fetchFaculties();
  }, []);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/courses");
      const courseData = res.data?.data || [];
      setCourses(courseData);
      
      const cMap = {};
      const dMap = {};
      let allDepts = [];

      courseData.forEach(course => {
        cMap[course._id] = course.courseName;
        if (course.departments && Array.isArray(course.departments)) {
          course.departments.forEach(dept => {
            dMap[dept._id] = dept.departmentName;
            allDepts.push({ ...dept, course: course._id });
          });
        }
      });
      
      setCourseMap(cMap);
      setDepartmentMap(dMap);
      setDepartments(allDepts);
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  // ================= FETCH FACULTIES =================
  const fetchFaculties = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/faculty");
      setFaculties(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to load faculties");
      setFaculties([]);
    }
  };

  // ================= GET DEPARTMENTS BY COURSE ✅ NEW
  const getDepartmentsByCourse = (courseId) => {
    // You can fetch course-departments mapping from backend or filter here
    // For now, showing all departments (modify as per your backend structure)
    return departments.filter(dept => 
      dept.course === courseId || !dept.course // Show all if no course filter
    );
  };

  // ================= ADD / UPDATE =================
  const submitFaculty = async () => {
    const { name, contact, email, course, department, password } = facultyForm;

    if (!name?.trim() || !contact?.trim() || !email?.trim() || !course || !department) {
      return toast.error("All fields are required");
    }

    if (!/^\d{10}$/.test(contact)) {
      return toast.error("Contact must be 10 digits");
    }

    setLoading(true);
    try {
      if (editIndex !== null) {
        const facultyId = faculties[editIndex]._id;
        const updateData = {
          name: name.trim(),
          contact,
          email: email.trim().toLowerCase(),
          course,
          department, // ✅ NEW: Save department
        };
        if (password) updateData.password = password;

        await axios.put(
          `http://localhost:3000/api/faculty/${facultyId}`,
          updateData
        );
        toast.success("✅ Faculty updated successfully");
      } else {
        await axios.post("http://localhost:3000/api/faculty", {
          ...facultyForm,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        });
        toast.success("✅ Faculty added successfully");
      }

      resetForm();
      fetchFaculties();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving faculty");
    } finally {
      setLoading(false);
    }
  };

  // ================= ON COURSE CHANGE ✅ NEW
  const handleCourseChange = (courseId) => {
    setFacultyForm({ ...facultyForm, course: courseId, department: "" });
    setSelectedCourse(courseId);
  };

  // ================= EDIT =================
  const editFaculty = (index) => {
    const f = faculties[index];
    const courseId = f.course?._id || f.course;
    const deptId = f.department?._id || f.department;

    setFacultyForm({
      name: f.name || "",
      contact: f.contact || "",
      email: f.email || "",
      course: courseId,
      department: deptId, // ✅ NEW
      password: "",
    });
    setSelectedCourse(courseId);
    setEditIndex(index);
    setShowForm(true);
  };

  // ================= DELETE =================
  const deleteFaculty = async (index) => {
    const f = faculties[index];
    if (!window.confirm(`Delete ${f.name}?`)) return;

    try {
      await axios.delete(`http://localhost:3000/api/faculty/${f._id}`);
      toast.success("✅ Faculty deleted successfully");
      fetchFaculties();
    } catch {
      toast.error("❌ Error deleting faculty");
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setFacultyForm({
      name: "",
      contact: "",
      email: "",
      course: "",
      department: "",
      password: "",
    });
    setSelectedCourse("");
    setEditIndex(null);
    setShowForm(false);
  };

  // ================= FILTERED FACULTIES =================
  const filteredFaculties = faculties.filter(f =>
    searchTerm === "" ||
    (f.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.contact || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (courseMap[f.course] || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (departmentMap[f.department] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <ToastContainer />

      <h3 className="text-center mb-4">🎓 Faculty Manager</h3>
      
      <div className="text-center mb-4">
        <button 
          className="btn btn-primary btn-lg py-3 px-5 fs-4 w-100" 
          onClick={() => setShowForm(!showForm)}
        >
          ➕ Add New Faculty
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card shadow-lg mb-5">
          <div className="card-body p-5">
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">👤 Faculty Name <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  placeholder="Enter faculty name"
                  value={facultyForm.name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">📱 Contact <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  placeholder="10 digit mobile number"
                  value={facultyForm.contact}
                  onChange={(e) => setFacultyForm({ ...facultyForm, contact: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">✉️ Email <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="faculty@example.com"
                  value={facultyForm.email}
                  onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                />
              </div>

              {/* ✅ COURSE DROPDOWN */}
              <div className="col-md-6">
                <label className="form-label fw-bold">🎓 Course <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={facultyForm.course}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ DEPARTMENT DROPDOWN - Course के according */}
              <div className="col-md-6">
                <label className="form-label fw-bold">🏢 Department <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={facultyForm.department}
                  disabled={!selectedCourse}
                  onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                >
                  <option value="">First select course</option>
                  {getDepartmentsByCourse(selectedCourse).map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">🔐 Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={
                    editIndex !== null ? "Leave empty to keep existing" : "Enter password"
                  }
                  value={facultyForm.password}
                  onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button 
                className="btn btn-primary w-100 py-3 fs-5" 
                onClick={submitFaculty}
                disabled={loading || !facultyForm.name || !facultyForm.contact || !facultyForm.email || !facultyForm.course || !facultyForm.department}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : editIndex !== null ? (
                  "💾 Update Faculty"
                ) : (
                  "➕ Add Faculty"
                )}
              </button>

              {editIndex !== null && (
                <button className="btn btn-secondary w-100 py-3 fs-5" onClick={resetForm}>
                  ❌ Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <UnifiedSearchFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by name, contact, email, course, or department..."
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Course</th>
                <th>Department</th> {/* ✅ NEW Column */}
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((f, i) => (
                  <tr key={f._id}>
                    <td>{i + 1}</td>
                    <td><strong>{f.name}</strong></td>
                    <td>{f.contact}</td>
                    <td>{f.email}</td>
                    <td>
                      <span className="badge bg-info">
                        {courseMap[f.course] || f.course?.courseName || "N/A"}
                      </span>
                    </td>
                    <td> {/* ✅ NEW Department Column */}
                      <span className="badge bg-warning">
                        {departmentMap[f.department] || f.department?.departmentName || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className={`btn btn-info ${editIndex === i ? 'btn-warning' : ''}`}
                          onClick={() => editFaculty(i)}
                        >
                          {editIndex === i ? '❌ Close' : '✏️ Edit'}
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteFaculty(i)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {searchTerm ? "❌ No matching faculty found" : "📭 No faculty added yet!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}