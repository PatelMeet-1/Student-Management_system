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
  
  const [isOpen, setIsOpen] = useState(false); // MOBILE default closed

  // ✅ FIX: screen resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Desktop = always open
      } else {
        setIsOpen(false); // Mobile = default closed
      }
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ MOBILE: close sidebar on tab click
  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ☰ MOBILE TOGGLE ONLY */}
      <button
        className="sidebar-toggle d-md-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div
        className={`sidebar bg-dark text-white ${
          isOpen ? "open" : "closed"
        }`}
      >
        <h5 className="text-center mb-3">🎓 HOD Panel</h5>
        <hr />

        <ul className="list-unstyled flex-grow-1">
          <li
            className={`sidebar-item ${isActive("/faculty-dashboard") && "active"}`}
            onClick={() => handleNavClick("/faculty-dashboard")}
          >
            <FaUser className="me-2" /> Personal Profile
          </li>

          <li
            className={`sidebar-item ${isActive("/internal-result") && "active"}`}
            onClick={() => handleNavClick("/internal-result")}
          >
            <FaClipboardList className="me-2" /> Internal Result
          </li>

          <li
            className={`sidebar-item ${isActive("/practical-result") && "active"}`}
            onClick={() => handleNavClick("/practical-result")}
          >
            <FaFlask className="me-2" /> Practical Result
          </li>
        </ul>

        <button className="btn btn-danger mt-3" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          padding: 20px;
          transition: transform 0.3s ease;
        }

        .sidebar-item {
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .sidebar-item:hover {
          background: #495057;
        }

        .active {
          background: #0d6efd;
        }

        /* MOBILE */
        @media (max-width: 767px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1030;
          }

          .sidebar.closed {
            transform: translateX(-110%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-toggle {
            position: fixed;
            top: 12px;
            left: 12px;
            z-index: 1040;
            background: #0d6efd;
            color: white;
            border: none;
            padding: 8px 10px;
            border-radius: 6px;
            font-size: 18px;
          }
        }

        /* DESKTOP */
        @media (min-width: 768px) {
          .sidebar {
            position: fixed;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
