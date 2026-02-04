import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CourseSemesterPage() {
  const [courseName, setCourseName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  const [semesterNumber, setSemesterNumber] = useState("");
  const [semesterSubjects, setSemesterSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [internalTotal, setInternalTotal] = useState("");
  const [practicalTotal, setPracticalTotal] = useState("");
  const [universityTotal, setUniversityTotal] = useState("");

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingDepIndex, setEditingDepIndex] = useState(null);
  const [editingSemIndex, setEditingSemIndex] = useState(null);

  const [courses, setCourses] = useState([]);

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/courses");
      setCourses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- ADD SUBJECT ----------------
  const addSubject = () => {
    if (!subjectName || !internalTotal || !practicalTotal || !universityTotal) return;

    const subject = {
      subjectName,
      internalTotal: Number(internalTotal),
      practicalTotal: Number(practicalTotal),
      universityTotal: Number(universityTotal)
    };

    setSemesterSubjects([...semesterSubjects, subject]);
    setSubjectName("");
    setInternalTotal("");
    setPracticalTotal("");
    setUniversityTotal("");
  };

  const removeSubject = (name) => {
    setSemesterSubjects(semesterSubjects.filter(s => s.subjectName !== name));
  };

  // ---------------- ADD SEMESTER ----------------
  const addSemester = (depIndex) => {
    if (!semesterNumber || semesterSubjects.length === 0) return;

    const semester = {
      semesterName: `Sem ${semesterNumber}`,
      subjects: semesterSubjects
    };

    const updatedDepartments = [...departments];

    if (editingSemIndex !== null) {
      // Edit semester
      updatedDepartments[depIndex].semesters[editingSemIndex] = semester;
      setEditingSemIndex(null);
    } else {
      if (!updatedDepartments[depIndex].semesters) updatedDepartments[depIndex].semesters = [];
      updatedDepartments[depIndex].semesters.push(semester);
    }

    setDepartments(updatedDepartments);
    setSemesterNumber("");
    setSemesterSubjects([]);
  };

  const editSemester = (depIndex, semIndex) => {
    const sem = departments[depIndex].semesters[semIndex];
    setSemesterNumber(sem.semesterName.replace("Sem ", ""));
    setSemesterSubjects(sem.subjects);
    setEditingDepIndex(depIndex);
    setEditingSemIndex(semIndex);
  };

  const removeSemester = (depIndex, semIndex) => {
    const updatedDepartments = [...departments];
    updatedDepartments[depIndex].semesters.splice(semIndex, 1);
    setDepartments(updatedDepartments);
  };

  // ---------------- ADD DEPARTMENT ----------------
  const addDepartment = () => {
    if (!departmentName) return;

    setDepartments([...departments, { departmentName, semesters: [] }]);
    setDepartmentName("");
  };

  const removeDepartment = (depIndex) => {
    const updated = [...departments];
    updated.splice(depIndex, 1);
    setDepartments(updated);
  };

  // ---------------- SUBMIT COURSE ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || departments.length === 0) {
      alert("Add course name and at least one department");
      return;
    }

    try {
      if (editingCourseId) {
        await axios.put(`http://localhost:3000/api/courses/${editingCourseId}`, {
          courseName,
          departments
        });
        alert("Course updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/courses/add", {
          courseName,
          departments
        });
        alert("Course added successfully!");
      }

      setCourseName("");
      setDepartments([]);
      setDepartmentName("");
      setSemesterNumber("");
      setSemesterSubjects([]);
      setEditingCourseId(null);
      setEditingDepIndex(null);
      setEditingSemIndex(null);
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert("Error saving course");
    }
  };

  // ---------------- EDIT COURSE ----------------
  const handleEdit = (course) => {
    setCourseName(course.courseName);
    setDepartments(course.departments || []);
    setEditingCourseId(course._id);
  };

  // ---------------- DELETE COURSE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert("Error deleting course");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="container mt-4">
      <h2>{editingCourseId ? "Edit Course" : "Add Course"}</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Course Name:</label>
          <input type="text" className="form-control" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
        </div>

        <div className="mb-2">
          <label>Department Name:</label>
          <div className="d-flex">
            <input type="text" className="form-control" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
            <button type="button" className="btn btn-info ms-2" onClick={addDepartment}>Add Department</button>
          </div>
        </div>

        {departments.map((dep, depIndex) => (
          <div key={depIndex} className="border p-2 my-2">
            <h5>
              {dep.departmentName}{" "}
              <span style={{ cursor: "pointer", color: "red" }} onClick={() => removeDepartment(depIndex)}>x</span>
            </h5>

            <div className="mb-2">
              <label>Semester Number:</label>
              <div className="d-flex">
                <input type="number" className="form-control" value={semesterNumber} onChange={(e) => setSemesterNumber(e.target.value)} min="1" />
                <button type="button" className="btn btn-info ms-2" onClick={() => addSemester(depIndex)}>
                  {editingSemIndex !== null ? "Update Semester" : "Add Semester"}
                </button>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-2">
              <label>Subject Name:</label>
              <input type="text" className="form-control mb-1" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
              <div className="d-flex mb-1">
                <input type="number" className="form-control me-1" placeholder="Internal Total" value={internalTotal} onChange={(e) => setInternalTotal(e.target.value)} />
                <input type="number" className="form-control me-1" placeholder="Practical Total" value={practicalTotal} onChange={(e) => setPracticalTotal(e.target.value)} />
                <input type="number" className="form-control" placeholder="University Total" value={universityTotal} onChange={(e) => setUniversityTotal(e.target.value)} />
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addSubject}>Add Subject</button>
              <div className="mt-1">
                {semesterSubjects.map(s => (
                  <div key={s.subjectName} className="badge bg-secondary me-1">
                    {s.subjectName} (I:{s.internalTotal}, P:{s.practicalTotal}, U:{s.universityTotal})
                    <span style={{ cursor: "pointer" }} onClick={() => removeSubject(s.subjectName)}> x</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing Semesters */}
            {dep.semesters?.map((sem, semIndex) => (
              <div key={semIndex} className="border p-1 my-1">
                <strong>{sem.semesterName}</strong>{" "}
                <span style={{ cursor: "pointer", color: "red" }} onClick={() => removeSemester(depIndex, semIndex)}>x</span>
                <button type="button" className="btn btn-warning btn-sm ms-2" onClick={() => editSemester(depIndex, semIndex)}>Edit Semester</button>
                <div>
                  {sem.subjects.map(sub => (
                    <div key={sub.subjectName}>
                      {sub.subjectName} (I:{sub.internalTotal}, P:{sub.practicalTotal}, U:{sub.universityTotal})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className="btn btn-success mt-2">{editingCourseId ? "Update Course" : "Save Course"}</button>
      </form>

      <h3>Existing Courses</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Departments & Semesters</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 && <tr><td colSpan="3" className="text-center">No courses added yet</td></tr>}
          {courses.map(c => (
            <tr key={c._id}>
              <td>{c.courseName}</td>
              <td>
                {c.departments?.map(dep => (
                  <div key={dep.departmentName}>
                    <strong>{dep.departmentName}</strong>
                    {dep.semesters?.map(sem => (
                      <div key={sem.semesterName}>
                        {sem.semesterName}:
                        {sem.subjects.map(sub => (
                          <span key={sub.subjectName}>
                            {" "}{sub.subjectName} (I:{sub.internalTotal}, P:{sub.practicalTotal}, U:{sub.universityTotal});
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(c)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
