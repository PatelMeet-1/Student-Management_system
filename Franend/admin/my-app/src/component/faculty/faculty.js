import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Faculty() {
  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseMap, setCourseMap] = useState({});
  const [filters, setFilters] = useState({ name: "", course: "" });

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    contact: "",
    email: "",
    course: "",
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
      
      const map = {};
      courseData.forEach(course => {
        map[course._id] = course.courseName;
      });
      setCourseMap(map);
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

  // ================= ADD / UPDATE =================
  const submitFaculty = async () => {
    const { name, contact, email, course, password } = facultyForm;

    if (!name?.trim() || !contact?.trim() || !email?.trim() || !course) {
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

  // ================= EDIT =================
  const editFaculty = (index) => {
    const f = faculties[index];
    const courseId = f.course?._id || f.course;

    setFacultyForm({
      name: f.name || "",
      contact: f.contact || "",
      email: f.email || "",
      course: courseId,
      password: "",
    });

    setEditIndex(index);
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
      password: "",
    });
    setEditIndex(null);
  };

  // ================= FILTERED FACULTIES (NO DEPARTMENT) =================
  const filteredFaculties = faculties.filter(f =>
    (f.name || "").toLowerCase().includes(filters.name.toLowerCase()) &&
    (courseMap[f.course] || "").toLowerCase().includes(filters.course.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <ToastContainer />

      {/* FORM */}
      <h3 className="text-center mb-4">🎓 Faculty Manager</h3>
      <div className="card shadow-lg mb-5">
        
        <div className="card-header bg-primary text-white p-4">
          <h4 className="mb-0">
            {editIndex !== null ? "✏️ Edit Faculty" : "➕ Add New Faculty"}
          </h4>
        </div>
        <div className="card-body p-5">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">👤 Faculty Name <span className="text-danger">*</span></label>
              <input
                className="form-control"
                placeholder="Enter faculty name"
                value={facultyForm.name}
                onChange={(e) =>
                  setFacultyForm({ ...facultyForm, name: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">📱 Contact <span className="text-danger">*</span></label>
              <input
                className="form-control"
                placeholder="10 digit mobile number"
                value={facultyForm.contact}
                onChange={(e) =>
                  setFacultyForm({ ...facultyForm, contact: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">✉️ Email <span className="text-danger">*</span></label>
              <input
                className="form-control"
                type="email"
                placeholder="faculty@example.com"
                value={facultyForm.email}
                onChange={(e) =>
                  setFacultyForm({ ...facultyForm, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">🎓 Course <span className="text-danger">*</span></label>
              <select
                className="form-select"
                value={facultyForm.course}
                onChange={(e) => setFacultyForm({ ...facultyForm, course: e.target.value })}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName}
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
                  editIndex !== null
                    ? "Leave empty to keep existing"
                    : "Enter password (min 6 chars)"
                }
                value={facultyForm.password}
                onChange={(e) =>
                  setFacultyForm({ ...facultyForm, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button 
              className="btn btn-primary w-100 py-3 fs-5" 
              onClick={submitFaculty}
              disabled={loading || !facultyForm.name || !facultyForm.contact || !facultyForm.email || !facultyForm.course}
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
              <button 
                className="btn btn-secondary w-100 py-3 fs-5" 
                onClick={resetForm}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTERS - NO DEPARTMENT */}
      <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">🔍 Quick Filters</h5>
        <div className="row g-3">
          <div className="col-md-5">
            <input 
              className="form-control" 
              placeholder="Faculty Name" 
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
          </div>
          <div className="col-md-5">
            <input 
              className="form-control" 
              placeholder="Course" 
              value={filters.course}
              onChange={(e) => setFilters({...filters, course: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <button 
              className="btn btn-outline-secondary w-100" 
              onClick={() => setFilters({ name: "", course: "" })}
            >
              🧹 Clear
            </button>
          </div>
        </div>
      </div>

      {/* TABLE - NO DEPARTMENT */}
      <div className="card shadow">
        <div className="card-header bg-success text-white p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>📋 Faculty List ({filteredFaculties.length}/{faculties.length})</h4>
            <button className="btn btn-light" onClick={fetchFaculties}>
              🔄 Refresh
            </button>
          </div>
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
                <th style={{ width: "180px" }}>Actions</th>
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
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className={`btn btn-info ${editIndex === i ? 'btn-warning' : ''}`}
                          onClick={() => editFaculty(i)}
                        >
                          {editIndex === i ? '❌ Close' : '✏️ Edit'}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteFaculty(i)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {Object.values(filters).some(f => f) 
                      ? "❌ No matching faculty found" 
                      : "📭 No faculty added yet. Add your first faculty above!"
                    }
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
