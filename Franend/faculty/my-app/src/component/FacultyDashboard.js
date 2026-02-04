import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  // ================= LOAD FACULTY DATA =================
  useEffect(() => {
    const storedData = localStorage.getItem("facultyData");

    if (!storedData) {
      navigate("/login");
      return;
    }

    const data = JSON.parse(storedData);
    setFaculty(data);
    setEmail(data.email || "");
    setContact(data.contact || "");
  }, [navigate]);

  // ================= UPDATE PROFILE =================
  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/faculty/${faculty.id}`,
        { email, contact }
      );

      const updatedFaculty = {
        ...faculty,
        email,
        contact,
      };

      localStorage.setItem("facultyData", JSON.stringify(updatedFaculty));
      setFaculty(updatedFaculty);

      alert("Profile Updated Successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Profile Update Failed ❌");
    }
  };

  if (!faculty) return null;

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="p-4 flex-grow-1">
        <h3 className="mb-4">Personal Profile</h3>

        <label>Name</label>
        <input
          className="form-control mb-2"
          value={faculty.name}
          disabled
        />

        <label>Email</label>
        <input
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contact</label>
        <input
          className="form-control mb-2"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <label>Department</label>
        <input
          className="form-control mb-3"
          value={faculty.department}
          disabled
        />

        <button className="btn btn-success" onClick={updateProfile}>
          Update Profile
        </button>
      </div>
    </div>
  );
}
