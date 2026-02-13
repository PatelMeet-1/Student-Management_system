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
  const [loading, setLoading] = useState(false);

  // ================= LOAD FACULTY DATA =================
  useEffect(() => {
    const storedData = localStorage.getItem("facultyData");

    if (!storedData) {
      navigate("/login");
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setFaculty(data);
      setEmail(data.email || "");
      setContact(data.contact || "");
    } catch (error) {
      console.error("Invalid faculty data");
      localStorage.removeItem("facultyData");
      navigate("/login");
    }
  }, [navigate]);

  // ================= UPDATE PROFILE =================
  const updateProfile = async () => {
    if (!email || !contact) {
      alert("Please fill all fields ❗");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:3000/api/faculty/${faculty.id}`,
        {
          email,
          contact,
        }
      );

      const updatedFaculty = {
        ...faculty,
        email,
        contact,
      };

      localStorage.setItem("facultyData", JSON.stringify(updatedFaculty));
      setFaculty(updatedFaculty);

      alert("Profile Updated Successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Profile Update Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!faculty) return null;

  return (
    <div className="d-flex min-vh-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4 bg-light content-shift">
        <h3 className="mb-4">Faculty Personal Profile</h3>

        <div className="card p-4 shadow-sm" style={{ maxWidth: "500px" }}>
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={faculty.name}
              disabled
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* CONTACT */}
          <div className="mb-3">
            <label className="form-label">Contact</label>
            <input
              className="form-control"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

        

          {/* BUTTON */}
          <button
            className="btn btn-success w-100"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
