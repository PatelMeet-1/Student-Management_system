import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaFlask,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [faculty, setFaculty] = useState(null);

  // ❌ NO REDIRECT HERE
  useEffect(() => {
    const storedFaculty = localStorage.getItem("faculty");
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="mb-4 text-center">
        <h3>🎓 Faculty Panel</h3>
        <small className="text-muted">
          {faculty?.name || "Faculty Dashboard"}
        </small>
      </div>

      <hr />

      <ul className="list-unstyled flex-grow-1">
        <li
          className={`sidebar-item ${isActive("/faculty-dashboard") && "active"}`}
          onClick={() => navigate("/faculty-dashboard")}
        >
          <FaUser className="me-2" /> Personal Profile
        </li>

        <li
          className={`sidebar-item ${isActive("/internal-result") && "active"}`}
          onClick={() => navigate("/internal-result")}
        >
          <FaClipboardList className="me-2" /> Internal Result
        </li>

        <li
          className={`sidebar-item ${isActive("/practical-result") && "active"}`}
          onClick={() => navigate("/practical-result")}
        >
          <FaFlask className="me-2" /> Practical Result
        </li>
      </ul>

      <button className="btn btn-danger mt-3" onClick={logout}>
        <FaSignOutAlt /> Logout
      </button>

      <style>
        {`
          .sidebar-item {
            cursor: pointer;
            padding: 10px;
            border-radius: 6px;
          }
          .sidebar-item:hover {
            background: #495057;
          }
          .active {
            background: #0d6efd;
          }
        `}
      </style>
    </div>
  );
}
