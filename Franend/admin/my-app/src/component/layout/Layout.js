import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ active, setActive, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Fixed button height
  const btnStyle = {
    height: "44px",
  };

  // ✅ Fixed sidebar width
  const SIDEBAR_WIDTH = "260px";

  return (
    <div className="min-vh-100">
      {/* ================= FIXED SIDEBAR ================= */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column position-fixed top-0 start-0"
        style={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <h4 className="text-center text-info mb-4">
          ADMIN PANEL
        </h4>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "course" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("course")}
        >
          Add Course & Semester
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "faculty" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("faculty")}
        >
          Add Faculty
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "students" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("students")}
        >
          Add Student
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "Result" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("Result")}
        >
          University Result Add
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "internal" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("internal")}
        >
          Internal Marks Result
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "practical" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("practical")}
        >
          Practical Marks Result
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "final" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("final")}
        >
          Final Result
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "circular" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("circular")}
        >
          Circular
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "timetable" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("timetable")}
        >
          Timetable
        </button>

        <button
          style={btnStyle}
          className={`btn w-100 mb-2 ${
            active === "finalcertificate" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setActive("finalcertificate")}
        >
          Final certificate
        </button>

        {/* ================= LOGOUT ================= */}
        <div className="mt-auto pt-3">
          <button
            style={btnStyle}
            className="btn btn-danger w-100 fw-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div
        className="bg-light p-4"
        style={{
          marginLeft: SIDEBAR_WIDTH, // 👈 sidebar ke baad content
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}
