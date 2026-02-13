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
  const [isOpen, setIsOpen] = useState(true);

  // ❌ NO REDIRECT HERE
  useEffect(() => {
    const storedFaculty = localStorage.getItem("faculty");
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty));
    }
    // initialize sidebar open state based on viewport width
    if (typeof window !== "undefined") {
      setIsOpen(window.innerWidth >= 768);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div
        className={`bg-dark text-white d-flex flex-column sidebar ${!isOpen ? "collapsed" : ""}`}
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
      <div className="mb-4 text-center">
        <h5>🎓 Faculty Panel</h5>
        
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
          /* Toggle button (mobile) */
          .sidebar-toggle {
            display: none;
          }

          /* Mobile behavior: hide/show sidebar with transform */
          @media (max-width: 767px) {
            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              height: 100vh;
              z-index: 1030;
              transform: translateX(0);
              transition: transform 0.25s ease-in-out;
              box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            }
            .sidebar.collapsed {
              transform: translateX(-110%);
            }
            .sidebar-toggle {
              display: inline-block;
              position: fixed;
              top: 12px;
              left: 12px;
              z-index: 1040;
              background: #0d6efd;
              color: #fff;
              border: none;
              padding: 8px 10px;
              border-radius: 6px;
              font-size: 18px;
              line-height: 1;
            }
          }

          /* Desktop: ensure toggle hidden and sidebar static */
          @media (min-width: 768px) {
            .sidebar {
              position: static;
              transform: none !important;
              box-shadow: none;
            }
            .sidebar-toggle {
              display: none;
            }
          }
        `}
      </style>
      </div>
    </>
  );
}
