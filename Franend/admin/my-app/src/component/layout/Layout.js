import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate, FaClipboardList, FaFlask, FaFileAlt, FaClock, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ active, setActive, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMenuClick = (key) => {
    setActive(key);
    // Close sidebar on mobile after clicking a menu item
    if (isMobile) {
      setSidebarOpen(false);
    }
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
    <div className="d-flex min-vh-100" style={{ position: "relative" }}>
      {/* ================= MOBILE TOGGLE BUTTON ================= */}
      {isMobile && (
        <button
          className="btn btn-info"
          style={{
            position: "fixed",
            top: "15px",
            left: "15px",
            zIndex: "9999",
            width: "50px",
            height: "50px",
            borderRadius: "8px",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* ================= OVERLAY (Mobile) ================= */}
      {sidebarOpen && isMobile && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: "998",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className="d-flex flex-column p-3"
        style={{
          width: isMobile ? SIDEBAR_WIDTH : SIDEBAR_WIDTH,
          height: "100vh",
          background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
          color: "#fff",
          overflowY: "auto",
          boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
          position: "fixed",
          top: "0",
          left: isMobile && !sidebarOpen ? "-260px" : "0",
          zIndex: "999",
          transition: "left 0.3s ease-in-out",
        }}
      >
        <h3
          className="text-center mb-4"
          style={{ 
            color: "#00ffe0", 
            fontWeight: "700", 
            marginTop: isMobile ? "50px" : "0",
            fontSize: isMobile ? "18px" : "24px",
          }}
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
              fontSize: isMobile ? "13px" : "14px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={() => handleMenuClick(item.key)}
            title={item.label}
          >
            <span style={{ marginRight: "10px", flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        {/* ================= LOGOUT ================= */}
        <div className="mt-auto pt-3">
          <button
            className="btn btn-danger w-100 fw-bold"
            style={{
              height: "45px",
              borderRadius: "8px",
              fontSize: isMobile ? "13px" : "14px",
              transition: "all 0.3s ease",
            }}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isMobile ? "0" : SIDEBAR_WIDTH,
          background: "#f4f7fa",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease-in-out",
          paddingTop: isMobile ? "70px" : "20px",
          paddingLeft: isMobile ? "15px" : "30px",
          paddingRight: isMobile ? "15px" : "30px",
          paddingBottom: "20px",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
