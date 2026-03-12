import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg position-fixed top-0 w-100 ${
        isOpen ? "navbar-expand-lg-expanded" : ""
      }`}
      style={{
        backgroundColor: "#19747E",
        zIndex: 1050,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        padding: "0.75rem 0"
      }}
    >
      <div className="container">

        {/* Brand */}
        <NavLink
          className="navbar-brand text-white fw-bold fs-3"
          to="/"
          onClick={closeNavbar}
        >
          Student Management
        </NavLink>

        {/* Toggle Button */}
        <button
          className={`navbar-toggler border-0 p-2 ${
            isOpen ? "collapsed" : ""
          }`}
          type="button"
          onClick={toggleNavbar}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{
            color: "white",
            background: "rgba(255,255,255,0.1)"
          }}
        >
          <span
            className="navbar-toggler-icon"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 30 30\'%3e%3cpath stroke=\'rgba%28255,255,255,0.9%29\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' stroke-width=\'2\' d=\'M4 7h22M4 15h22M4 23h22\'/%3e%3c/svg%3e")'
            }}
          />
        </button>

        {/* Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Home */}
            <li className="nav-item">
              <NavLink
                to="/"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 py-2 mx-1 ${
                    isActive ? "text-warning" : "text-white"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* About */}
            <li className="nav-item">
              <NavLink
                to="/about"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 py-2 mx-1 ${
                    isActive ? "text-warning" : "text-white"
                  }`
                }
              >
                About
              </NavLink>
            </li>

            {/* Courses */}
            <li className="nav-item">
              <NavLink
                to="/courses"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 py-2 mx-1 ${
                    isActive ? "text-warning" : "text-white"
                  }`
                }
              >
                Courses
              </NavLink>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <NavLink
                to="/contactus"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 py-2 mx-1 ${
                    isActive ? "text-warning" : "text-white"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>

            {/* Login Button */}
            <li className="nav-item ms-3">
              <a
                href="https://student-management-system-1frantuser.onrender.com"
                className="btn px-4 py-2 fw-bold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderRadius: "25px",
                  backdropFilter: "blur(10px)"
                }}
                onClick={closeNavbar}
              >
                🔐 Login
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;