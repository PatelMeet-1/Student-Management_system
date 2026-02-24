import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SemesterWiseTotalMarks() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [internalMarks, setInternalMarks] = useState("");
  const [practicalMarks, setPracticalMarks] = useState("");
  const [universityMarks, setUniversityMarks] = useState("");
  const [marksList, setMarksList] = useState([]); // show all marks

  // Load courses & total marks
  useEffect(() => {
    fetchCourses();
    fetchTotalMarks();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/courses`);
      setCourses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalMarks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/totalmarks`);
      setMarksList(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Submit marks
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !semester) {
      alert("Select course and semester");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/totalmarks/add`, {
        courseId,
        semester,
        internalMarks: Number(internalMarks),
        practicalMarks: Number(practicalMarks),
        universityMarks: Number(universityMarks)
      });
      alert("Total marks added successfully!");
      setInternalMarks(""); 
      setPracticalMarks(""); 
      setUniversityMarks("");
      fetchTotalMarks(); // refresh table
    } catch (err) {
      console.log(err);
      alert("Error adding marks");
    }
  };

  // Delete marks
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/totalmarks/${id}`);
        fetchTotalMarks();
      } catch (err) {
        console.log(err);
        alert("Error deleting record");
      }
    }
  };

  // Update marks (load in form)
  const handleEdit = (record) => {
    setCourseId(record.courseId._id);
    setSemester(record.semester);
    setInternalMarks(record.internalMarks);
    setPracticalMarks(record.practicalMarks);
    setUniversityMarks(record.universityMarks);
  };

  const semesters = courses.find(c => c._id === courseId)?.semesters || [];

  return (
    <div>
      <h2>Semester Wise Total Marks</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Course:</label>
          <select className="form-control" value={courseId} onChange={e => setCourseId(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
          </select>
        </div>

        <div className="mb-2">
          <label>Semester:</label>
          <select className="form-control" value={semester} onChange={e => setSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((s,i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mb-2">
          <label>Internal Marks:</label>
          <input type="number" className="form-control" value={internalMarks} onChange={e => setInternalMarks(e.target.value)} />
        </div>

        <div className="mb-2">
          <label>Practical Marks:</label>
          <input type="number" className="form-control" value={practicalMarks} onChange={e => setPracticalMarks(e.target.value)} />
        </div>

        <div className="mb-2">
          <label>University Marks:</label>
          <input type="number" className="form-control" value={universityMarks} onChange={e => setUniversityMarks(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-success mt-2">Save Marks</button>
      </form>

      {/* Table */}
      <h3 className="mt-4">All Total Marks</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Course</th>
            <th>Semester</th>
            <th>Internal</th>
            <th>Practical</th>
            <th>University</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marksList.map(record => (
            <tr key={record._id}>
              <td>{record.courseId.courseName}</td>
              <td>{record.semester}</td>
              <td>{record.internalMarks}</td>
              <td>{record.practicalMarks}</td>
              <td>{record.universityMarks}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(record)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(record._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {marksList.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
