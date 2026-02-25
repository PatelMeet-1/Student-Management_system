import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function HomePage() {
  return (
    <Container className="py-5">
      {/* 1. Hero */}
      <section className="text-center py-5 bg-primary bg-opacity-10 rounded-4 mb-5">
        <h1 className="display-4 fw-bold text-dark mb-4">Welcome to SRMS</h1>
        <p className="lead mb-4">Student Result Management System</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button variant="primary" size="lg" className="rounded-pill px-4">🚀 Get Started</Button>
          <Button variant="outline-primary" size="lg" className="rounded-pill px-4">📚 Learn More</Button>
        </div>
      </section>

      {/* 2. Features */}
      <section className="mb-5">
        <h2 className="text-center h2 fw-bold mb-5">✨ Key Features</h2>
        <Row>
          {[
            { icon: '📊', title: 'Result Management', desc: 'Internal & Practical marks' },
            { icon: '🔐', title: '3 Secure Panels', desc: 'Admin, Faculty, Student' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Works on all devices' },
            { icon: '⚡', title: 'Fast Access', desc: 'Instant result viewing' }
          ].map((feature, idx) => (
            <Col lg={3} md={6} key={idx} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="display-3 mb-3 text-primary">{feature.icon}</div>
                  <Card.Title className="h5 fw-bold mb-2">{feature.title}</Card.Title>
                  <Card.Text>{feature.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 3. Stats */}
      <section className="bg-light py-5 rounded-3 mb-5">
        <Row className="text-center">
          <Col md={3} className="mb-4">
            <h1 className="display-1 fw-bold text-primary">3</h1>
            <h5>User Panels</h5>
          </Col>
          <Col md={3} className="mb-4">
            <h1 className="display-1 fw-bold text-success">100%</h1>
            <h5>Responsive</h5>
          </Col>
          <Col md={3} className="mb-4">
            <h1 className="display-1 fw-bold text-warning">24/7</h1>
            <h5>Access</h5>
          </Col>
          <Col md={3} className="mb-4">
            <h1 className="display-1 fw-bold text-danger">🔒</h1>
            <h5>Secure</h5>
          </Col>
        </Row>
      </section>

      {/* 4. How it Works */}
      <section className="mb-5">
        <h2 className="text-center h2 fw-bold mb-5">🎯 How It Works</h2>
        <Row>
          <Col lg={4} className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 p-4" style={{width: 100, height: 100}}>
              <h2 className="fw-bold text-primary m-0">1</h2>
            </div>
            <h4>Choose Panel</h4>
            <p>Admin, Faculty or Student login</p>
          </Col>
          <Col lg={4} className="text-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 p-4" style={{width: 100, height: 100}}>
              <h2 className="fw-bold text-success m-0">2</h2>
            </div>
            <h4>Secure Login</h4>
            <p>OTP verification system</p>
          </Col>
          <Col lg={4} className="text-center mb-4">
            <div className="bg-info bg-opacity-10 rounded-circle mx-auto mb-3 p-4" style={{width: 100, height: 100}}>
              <h2 className="fw-bold text-info m-0">3</h2>
            </div>
            <h4>Access Results</h4>
            <p>View & manage instantly</p>
          </Col>
        </Row>
      </section>

      {/* 5. CTA Section */}
      <section className="bg-primary text-white text-center py-5 rounded-3 mb-5">
        <h2 className="h2 fw-bold mb-3">Ready to Start?</h2>
        <p className="lead mb-4">Choose your panel and get started</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button variant="light" size="lg" className="rounded-pill px-4 fw-bold me-2"
                  onClick={() => window.location.href = "/admin-login"}>
            👑 Admin Login
          </Button>
          <Button variant="outline-light" size="lg" className="rounded-pill px-4 fw-bold me-2"
                  onClick={() => window.location.href = "/faculty-login"}>
            👨‍🏫 Faculty Login
          </Button>
          <Button variant="outline-light" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/student-login"}>
            🎓 Student Login
          </Button>
        </div>
      </section>

      {/* 6. Quick Login */}
      <section className="text-center mb-5">
        <h3 className="h3 fw-bold mb-4">🔑 Quick Login</h3>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button variant="danger" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/admin-login"}>
            👑 Admin Panel
          </Button>
          <Button variant="warning" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/faculty-login"}>
            👨‍🏫 Faculty Panel
          </Button>
          <Button variant="primary" size="lg" className="rounded-pill px-4 fw-bold"
                  onClick={() => window.location.href = "/student-login"}>
            🎓 Student Panel
          </Button>
        </div>
      </section>

      {/* 7. Why Choose Us */}
      <section className="mb-5">
        <h2 className="text-center h2 fw-bold mb-5">✅ Why Choose SRMS?</h2>
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 bg-light h-100">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2 text-primary">🔒 Secure</h5>
                <p className="lead">Separate panels with OTP authentication</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card className="border-0 bg-light h-100">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2 text-success">📱 Responsive</h5>
                <p className="lead">Works perfectly on mobile & desktop</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* 8. Footer */}
      <section className="bg-dark text-white text-center py-5 rounded-3">
        <h4 className="fw-bold mb-3">🎓 Student Result Management System</h4>
        <p className="lead">Simple. Secure. Efficient. © 2026</p>
      </section>
    </Container>
  );
}
