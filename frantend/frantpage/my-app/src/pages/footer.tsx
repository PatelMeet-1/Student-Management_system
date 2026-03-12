import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "#19747E" }}
    >
      <div className="container py-5">
        <div className="row text-center text-md-start">

          {/* Project Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Student Management System</h5>
            <p>
              A smart platform to manage students, departments and courses
              efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Quick Links</h5>

            <p className="mb-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "text-warning fw-bold" : "text-white"
                  }`
                }
              >
                Home
              </NavLink>
            </p>

            <p className="mb-1">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "text-warning fw-bold" : "text-white"
                  }`
                }
              >
                About
              </NavLink>
            </p>

            <p className="mb-1">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "text-warning fw-bold" : "text-white"
                  }`
                }
              >
                Courses
              </NavLink>
            </p>

            <p className="mb-1">
              <NavLink
                to="/contactus"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "text-warning fw-bold" : "text-white"
                  }`
                }
              >
                Contact
              </NavLink>
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Contact</h5>

            <p className="mb-1">📧 patelmeetbhai6333@gmail.com</p>
            <p className="mb-1">📞 +91 9328407114</p>
            <p className="mb-1">📍Surendranagar, Gujarat, India</p>

            {/* Social Icons */}
            <div className="mt-3">

              <i
                className="bi bi-facebook me-3"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#A9D6E5"
                }}
              ></i>

              <i
                className="bi bi-instagram me-3"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#A9D6E5"
                }}
              ></i>

              <i
                className="bi bi-linkedin me-3"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#A9D6E5"
                }}
              ></i>

              <i
                className="bi bi-twitter"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#A9D6E5"
                }}
              ></i>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className="text-center py-3"
        style={{
          backgroundColor: "#D1E8E2",
          color: "#19747E"
        }}
      >
        © 2026 Student Management System | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;