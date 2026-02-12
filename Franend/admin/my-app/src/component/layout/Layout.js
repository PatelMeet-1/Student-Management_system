import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate, FaClipboardList, FaFlask, FaFileAlt, FaClock, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ active, setActive, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const SIDEBAR_WIDTH = "260px";

  const menuItems = [
    { key: "course", label: "Add Course & Semester", icon: <FaChalkboardTeacher /> },
    { key: "faculty", label: "Add Faculty", icon: <FaUserGraduate /> },
    { key: "students", label: "Add Student", icon: <FaClipboardList /> },
    { key: "Result", label: "University Result Add", icon: <FaFileAlt /> },
    { key: "internal", label: "Internal Marks Result", icon: <FaFileAlt /> },
    { key: "practical", label: "Practical Marks Result", icon: <FaFlask /> },
    { key: "final", label: "Final Result", icon: <FaFileAlt /> },
    { key: "circular", label: "Circular", icon: <FaClock /> },
    { key: "timetable", label: "Timetable", icon: <FaClock /> },
    // { key: "finalcertificate", label: "Final Certificate", icon: <FaFileAlt /> },
  ];

  return (
    <div className="d-flex min-vh-100">
      {/* ================= SIDEBAR ================= */}
      <div
        className="d-flex flex-column p-3 position-fixed top-0 start-0"
        style={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
          color: "#fff",
          overflowY: "auto",
          boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
        }}
      >
        <h3
          className="text-center mb-4"
          style={{ color: "#00ffe0", fontWeight: "700" }}
        >
          ADMIN PANEL
        </h3>

        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`btn w-100 mb-2 text-start ${
              active === item.key
                ? "bg-info text-dark fw-bold"
                : "btn-outline-light"
            }`}
            style={{
              height: "45px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}

        {/* ================= LOGOUT ================= */}
        <div className="mt-auto pt-3">
          <button
            className="btn btn-danger w-100 fw-bold"
            style={{
              height: "45px",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: SIDEBAR_WIDTH,
          background: "#f4f7fa",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}
