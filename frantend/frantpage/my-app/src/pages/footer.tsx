import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "#19747E" }} // Dark Cyan
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
              <Link to="/" className="text-white text-decoration-none">
                Home
              </Link>
            </p>

            <p className="mb-1">
              <Link to="/about" className="text-white text-decoration-none">
                About
              </Link>
            </p>

            <p className="mb-1">
              <Link to="/courses" className="text-white text-decoration-none">
                Courses
              </Link>
            </p>

            <p className="mb-1">
              <Link to="/contact" className="text-white text-decoration-none">
                Contact
              </Link>
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Contact</h5>

            <p className="mb-1">📧 patelmeetbhai6333@gmail.com</p>
            <p className="mb-1">📞 +91 9328407114</p>
            <p className="mb-1">📍Surendranagar,Gujrat, India</p>

            {/* Social Icons */}
            <div className="mt-3">
              <i
                className="bi bi-facebook me-3"
                style={{ 
                  fontSize: "20px", 
                  cursor: "pointer",
                  color: "#A9D6E5" // Light Blue
                }}
              ></i>

              <i
                className="bi bi-instagram me-3"
                style={{ 
                  fontSize: "20px", 
                  cursor: "pointer",
                  color: "#A9D6E5" // Light Blue
                }}
              ></i>

              <i
                className="bi bi-linkedin me-3"
                style={{ 
                  fontSize: "20px", 
                  cursor: "pointer",
                  color: "#A9D6E5" // Light Blue
                }}
              ></i>

              <i
                className="bi bi-twitter"
                style={{ 
                  fontSize: "20px", 
                  cursor: "pointer",
                  color: "#A9D6E5" // Light Blue
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
          backgroundColor: "#D1E8E2", // Soft Mint Green
          color: "#19747E" // Dark Cyan text
        }}
      >
        © 2026 Student Management System | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
