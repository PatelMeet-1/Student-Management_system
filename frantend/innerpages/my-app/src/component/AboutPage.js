// AboutPage.js - Professional Card Layout Version
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function AboutPage() {
  return (
    <Container className="py-5">

      {/* 1. Hero Section */}
      <section className="text-center py-5 bg-info bg-opacity-10 rounded-3 mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">About SRMS</h1>
        <p className="lead text-secondary">Student Result Management System</p>
      </section>

      {/* 2. Mission */}
      <section className="mb-5">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-5 text-center">
            <h2 className="fw-bold text-primary mb-3">🎯 Our Mission</h2>
            <p className="lead text-secondary">
              Provide secure & efficient result management for educational institutions
            </p>
          </Card.Body>
        </Card>
      </section>

      {/* 3. Features (Card Style) */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-5">✨ Features</h2>
        <Row>
          {[
            { color: 'primary', icon: '🔐', title: '3 Panels', desc: 'Admin, Faculty, Student' },
            { color: 'success', icon: '📊', title: 'Results', desc: 'Internal & Practical' },
            { color: 'warning', icon: '⚡', title: 'Fast', desc: 'Instant Access' },
            { color: 'info', icon: '📱', title: 'Mobile', desc: 'All Devices' }
          ].map((feature, idx) => (
            <Col lg={3} md={6} key={idx} className="mb-4">
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <div className={`bg-${feature.color} text-white rounded-circle mx-auto mb-3 p-3 fs-3`}>
                  {feature.icon}
                </div>
                <Card.Title className="fw-bold">{feature.title}</Card.Title>
                <Card.Text className="text-secondary">{feature.desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 4. Timeline */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-5">📅 Timeline</h2>
        <Row>
          {[
            { year: '2024', title: 'SRMS Launched', desc: 'First version released', color: 'primary' },
            { year: '2025', title: '3 Panels Added', desc: 'Admin, Faculty, Student', color: 'success' },
            { year: '2026', title: 'OTP Security', desc: 'Enhanced security', color: 'warning' }
          ].map((item, idx) => (
            <Col lg={4} key={idx} className="mb-4">
              <Card className="border-0 shadow-sm h-100 text-center p-4">
                <Card.Body>
                  <h3 className={`fw-bold text-${item.color}`}>{item.year}</h3>
                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="text-secondary">{item.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 5. CTA */}
      <section className="bg-warning bg-opacity-10 py-5 rounded-3 mb-5 text-center">
        <h2 className="fw-bold mb-3">🚀 Start Using SRMS</h2>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button variant="danger" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/admin-login"}>
            👑 Admin Login
          </Button>
          <Button variant="warning" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/faculty-login"}>
            👨‍🏫 Faculty Login
          </Button>
          <Button variant="primary" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/student-login"}>
            🎓 Student Login
          </Button>
        </div>
      </section>

      {/* 6. Team (Card Style) */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-5">👥 Team</h2>
        <Row>
          {[
            { role: 'Admin Team', icon: '👨‍💻', desc: 'System Management', color: 'primary' },
            { role: 'Faculty', icon: '👨‍🏫', desc: 'Result Entry', color: 'warning' },
            { role: 'Students', icon: '🎓', desc: 'Result Access', color: 'success' }
          ].map((member, idx) => (
            <Col lg={4} md={6} key={idx} className="mb-4">
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <div className={`bg-${member.color} text-white rounded-circle mx-auto mb-3 p-4 fs-1`}>
                  {member.icon}
                </div>
                <Card.Title className="fw-bold">{member.role}</Card.Title>
                <Card.Text className="text-secondary">{member.desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 7. Benefits */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-5">✅ Benefits</h2>
        <Row>
          {[
            { title: 'Secure Access', desc: 'Separate login for each user type', color: 'success' },
            { title: 'Mobile Ready', desc: 'Works on all devices perfectly', color: 'primary' },
            { title: 'Fast Loading', desc: 'Instant result display', color: 'warning' },
            { title: 'Complete Data', desc: 'Internal + Practical marks', color: 'info' }
          ].map((benefit, idx) => (
            <Col lg={6} key={idx} className="mb-4">
              <Card className="border-0 shadow-sm h-100 p-4">
                <Card.Body>
                  <h5 className={`fw-bold text-${benefit.color}`}>{benefit.title}</h5>
                  <p className="text-secondary">{benefit.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 8. Footer */}
      <section className="bg-dark text-white text-center py-5 rounded-3">
        <h4 className="fw-bold mb-3">🎓 SRMS - About</h4>
        <p className="text-secondary mb-0">Managing academic excellence</p>
      </section>

    </Container>
  );
}