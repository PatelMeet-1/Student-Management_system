import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddStudent() {
  const API_URL = "http://localhost:3000/api/users";
  const COURSES_URL = "http://localhost:3000/api/courses";

  const [studentForm, setStudentForm] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    password: "",
    course: "",
    department: "",
    EnrollmentNo: "",
    photo: "",
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseDepts, setSelectedCourseDepts] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [filters, setFilters] = useState({
    enrollment: "",
    course: "",
    department: "",
    name: "",
  });

  // LOAD USERS
  const loadUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading students");
      setUsers([]);
    }
  };

  // LOAD COURSES
  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await axios.get(COURSES_URL);
      const coursesData =
        res.data.success && Array.isArray(res.data.data) ? res.data.data : [];
      const courseNames = coursesData.map((course) => ({
        _id: course._id,
        name: course.courseName,
        departments: course.departments || [],
      }));
      setCourses(courseNames);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Error loading courses");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // FILTER DEPARTMENTS BY COURSE
  const handleCourseChange = (courseName) => {
    setStudentForm({ ...studentForm, course: courseName, department: "" });
    const selectedCourse = courses.find((course) => course.name === courseName);
    if (selectedCourse && selectedCourse.departments) {
      const courseDepts = selectedCourse.departments
        .map((dept) => dept.departmentName)
        .filter(Boolean);
      setSelectedCourseDepts(courseDepts);
    } else {
      setSelectedCourseDepts([]);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCourses();
  }, []);

  // PHOTO UPLOAD
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // SUBMIT/UPDATE STUDENT
  const submitStudent = async () => {
    if (
      !studentForm.name ||
      !studentForm.EnrollmentNo ||
      !studentForm.course ||
      !studentForm.department
    )
      return toast.error("Name, EnrollmentNo, Course & Department required");

    try {
      const formData = new FormData();
      for (let key in studentForm) formData.append(key, studentForm[key]);
      if (selectedPhoto) formData.append("photo", selectedPhoto);

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Student Updated!");
        setEditId(null);
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Student Added!");
      }

      setStudentForm({
        name: "",
        age: "",
        contact: "",
        email: "",
        password: "",
        course: "",
        department: "",
        EnrollmentNo: "",
        photo: "",
      });
      setSelectedPhoto(null);
      setPhotoPreview("");
      setSelectedCourseDepts([]);
      loadUsers();
    } catch (error) {
      console.error("Error submitting student:", error);
      toast.error("❌ Error adding/updating student");
    }
  };

  // EDIT STUDENT
  const handleEdit = (user) => {
    setStudentForm({
      ...user,
      course: user.course || "",
      department: user.department || "",
    });
    setEditId(user._id);

    if (user.course) {
      const selectedCourse = courses.find(
        (course) => course.name === user.course
      );
      if (selectedCourse) {
        setSelectedCourseDepts(
          selectedCourse.departments
            .map((dept) => dept.departmentName)
            .filter(Boolean)
        );
      }
    }

    setSelectedPhoto(null);
    setPhotoPreview(
      user.photo?.startsWith("/uploads/")
        ? `http://localhost:3000${user.photo}`
        : user.photo || ""
    );
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("✅ Student Deleted!");
      loadUsers();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("❌ Error deleting student");
    }
  };

  // FILTERED USERS
  const filteredUsers = users.filter(
    (user) =>
      (user.EnrollmentNo || "")
        .toLowerCase()
        .includes(filters.enrollment.toLowerCase()) &&
      (user.course || "")
        .toLowerCase()
        .includes(filters.course.toLowerCase()) &&
      (user.department || "")
        .toLowerCase()
        .includes(filters.department.toLowerCase()) &&
      (user.name || "").toLowerCase().includes(filters.name.toLowerCase())
  );

  if (loadingCourses) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <h4 className="mt-3">Loading courses...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer />

      {/* 👇 Page now starts directly from here */}
      <h3 className="text-center mb-4">👨‍🎓 Student Manager</h3>

      {/* FORM */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white p-3">
          <h5>{editId ? "✏️ Edit Student" : "➕ Add Student"}</h5>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="👤 Name *"
                value={studentForm.name}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, name: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="📅 Age"
                value={studentForm.age}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, age: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="📱 Contact"
                value={studentForm.contact}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, contact: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="email"
                placeholder="✉️ Email"
                value={studentForm.email}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, email: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="password"
                placeholder="🔐 Password"
                value={studentForm.password}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, password: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={studentForm.course}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">🎓 Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={studentForm.department}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, department: e.target.value })
                }
                disabled={!studentForm.course}
              >
                <option value="">
                  {studentForm.course
                    ? "🏢 Select Department"
                    : "First select course"}
                </option>
                {selectedCourseDepts.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <input
                className="form-control"
                placeholder="🆔 Enrollment No *"
                value={studentForm.EnrollmentNo}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    EnrollmentNo: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold mb-2">📸 Photo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-2 rounded shadow"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>
          <button
            className="btn btn-primary w-100 mt-4 py-2 fs-5"
            onClick={submitStudent}
          >
            {editId ? "💾 Update Student" : "➕ Add Student"}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card p-3 mb-4">
        <h6>🔍 Filters</h6>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Enrollment No"
              value={filters.enrollment}
              onChange={(e) =>
                setFilters({ ...filters, enrollment: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Course"
              value={filters.course}
              onChange={(e) =>
                setFilters({ ...filters, course: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Department"
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
            />
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() =>
                setFilters({
                  enrollment: "",
                  name: "",
                  course: "",
                  department: "",
                })
              }
            >
              🧹
            </button>
          </div>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <div className="card shadow">
        <div className="card-header bg-success text-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>
              📋 All Students ({filteredUsers.length}/{users.length})
            </h5>
            <button className="btn btn-light btn-sm" onClick={loadUsers}>
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Enrollment</th>
                <th>Course</th>
                <th>Dept</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    {Object.values(filters).some((f) => f)
                      ? "❌ No matches"
                      : "📭 No students"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>
                      {u.photo && (
                        <img
                          src={
                            u.photo.startsWith("/uploads/")
                              ? `http://localhost:3000${u.photo}`
                              : u.photo
                          }
                          alt={u.name}
                          className="rounded-circle"
                          style={{
                            width: 45,
                            height: 45,
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </td>
                    <td>{u.name}</td>
                    <td>
                      <strong>{u.EnrollmentNo}</strong>
                    </td>
                    <td>{u.course || "N/A"}</td>
                    <td>{u.department || "N/A"}</td>
                    <td>{u.contact}</td>
                    <td>{u.email}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className={`btn ${
                            editId === u._id ? "btn-warning" : "btn-info"
                          }`}
                          onClick={() => handleEdit(u)}
                        >
                          {editId === u._id ? "❌ Close" : "✏️ Edit"}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(u._id)}
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
    </div>
  );
}
