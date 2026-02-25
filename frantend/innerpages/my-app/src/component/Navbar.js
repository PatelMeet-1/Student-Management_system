// NavbarComponent.js - Professional & Clean Navbar
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

export default function NavbarComponent() {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fs-3 fw-bold text-light">
          🎓 SRMS
        </Navbar.Brand>

        {/* Toggle for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation links */}
          <Nav className="me-auto ms-4">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active fw-bold' : ''}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className={location.pathname === '/about' ? 'active fw-bold' : ''}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className={location.pathname === '/contact' ? 'active fw-bold' : ''}>
              Contact
            </Nav.Link>
          </Nav>

          {/* Login Buttons */}
          <div className="d-flex gap-2">
            <Button
              as={Link}
              to="/admin-login"
              variant="outline-light"
              size="sm"
              className="rounded-pill px-3"
            >
              Admin
            </Button>
            <Button
              as={Link}
              to="/faculty-login"
              variant="outline-warning"
              size="sm"
              className="rounded-pill px-3 text-dark"
            >
              Faculty
            </Button>
            <Button
              as={Link}
              to="/student-login"
              variant="outline-success"
              size="sm"
              className="rounded-pill px-3"
            >
              Student
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}