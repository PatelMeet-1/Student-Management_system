import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg position-fixed top-0 w-100" // ✅ position-fixed + top-0 + w-100 add kiya
      style={{ 
        backgroundColor: "#19747E",
        zIndex: 1050, // ✅ High z-index for proper layering
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)" // ✅ Subtle shadow
      }}
    >
      <div className="container">

        <Link className="navbar-brand text-white fw-bold fs-3" to="/"> {/* ✅ fs-3 for bigger brand */}
          Student Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ border: "none" }} // ✅ Clean toggler
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse pt-2" id="navbarNav"> {/* ✅ pt-2 for spacing */}
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold px-3 py-2" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold px-3 py-2" to="/about">About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold px-3 py-2" to="/courses">Courses</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold px-3 py-2" to="/contact">Contact</Link>
            </li>

            <li className="nav-item ms-3">
              <button
                className="btn"
                style={{ backgroundColor: "#E2E2E2" }}
              >
                Login
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
