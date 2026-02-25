// ContactPage.js - Professional Card Layout Version
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <Container className="py-5">

      {/* 1. Hero Section */}
      <section className="text-center py-5 bg-success bg-opacity-10 rounded-3 mb-5">
        <h1 className="display-4 fw-bold text-success mb-3">📞 Contact Us</h1>
        <p className="lead text-secondary">Get in touch with our team</p>
      </section>

      {/* 2. Contact Info (Card Style) */}
      <Row className="mb-5">
        {[
          { icon: '📧', title: 'Email', info: 'support@srms.edu', color: 'primary' },
          { icon: '📱', title: 'Phone', info: '+91 98765 43210', color: 'success' },
          { icon: '📍', title: 'Address', info: 'University Campus, India', color: 'warning' },
        ].map((item, idx) => (
          <Col lg={4} md={6} key={idx} className="mb-4">
            <Card className="border-0 shadow-sm text-center p-4 h-100">
              <div className={`bg-${item.color} text-white rounded-circle mx-auto mb-3 p-3 fs-3`}>
                {item.icon}
              </div>
              <Card.Title className="fw-bold">{item.title}</Card.Title>
              <Card.Text className="text-secondary">{item.info}</Card.Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 3. Contact Form */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <h3 className="fw-bold mb-4 text-center text-primary">💬 Send Message</h3>
              
              {status === 'success' && (
                <Alert variant="success" className="mb-4">
                  ✅ Message sent successfully!
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Control 
                      size="lg" 
                      placeholder="👤 Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Control 
                      type="email"
                      size="lg" 
                      placeholder="📧 Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Col>
                </Row>
                <Form.Control 
                  as="textarea" 
                  rows={5}
                  size="lg"
                  placeholder="💬 Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="mb-4"
                  required
                />
                <Button type="submit" size="lg" className="w-100 fw-bold rounded-pill py-3" variant="success">
                  🚀 Send Message
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 4. Quick Login (Card Style) */}
      <section className="text-center mb-5">
        <h3 className="fw-bold mb-4">🔑 Quick Access</h3>
        <Row className="justify-content-center">
          {[
            { label: '👑 Admin Login', link: '/admin-login', color: 'danger' },
            { label: '👨‍🏫 Faculty Login', link: '/faculty-login', color: 'warning' },
            { label: '🎓 Student Login', link: '/student-login', color: 'primary' }
          ].map((item, idx) => (
            <Col lg={3} md={4} sm={6} key={idx} className="mb-3">
              <Card 
                className={`shadow-sm border-0 text-center py-3 rounded-pill cursor-pointer`}
                style={{backgroundColor: `${item.color}20`}} 
                onClick={() => window.location.href = item.link}
              >
                <Card.Body className={`text-${item.color} fw-bold`}>{item.label}</Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 5. Office Hours */}
      <section className="mb-5">
        <Card className="border-0 bg-info bg-opacity-10 text-center shadow-sm p-4">
          <h4 className="fw-bold text-info mb-2">🕒 Office Hours</h4>
          <p className="lead text-secondary mb-0">Monday - Saturday: 9AM - 6PM</p>
        </Card>
      </section>

      {/* 6. Support */}
      <section className="mb-5">
        <h3 className="text-center fw-bold mb-4">🛠️ Support</h3>
        <Row>
          <Col lg={6} md={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center py-4 cursor-pointer">
              <Card.Body>
                <h5 className="text-primary fw-bold">📚 Documentation</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} md={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center py-4 cursor-pointer">
              <Card.Body>
                <h5 className="text-success fw-bold">💬 Live Chat</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* 7. FAQ (Card Style) */}
      <section className="mb-5">
        <h3 className="text-center fw-bold mb-4">❓ FAQ</h3>
        <Row>
          {[
            { q: 'How to login?', a: 'Choose your panel and use credentials' },
            { q: 'Forgot password?', a: 'Use forgot password with OTP' }
          ].map((item, idx) => (
            <Col lg={6} md={6} key={idx} className="mb-3">
              <Card className="border-0 shadow-sm p-3 h-100">
                <Card.Body>
                  <h6 className="fw-bold">{item.q}</h6>
                  <p className="text-secondary small">{item.a}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 8. Footer */}
      <section className="bg-dark text-white text-center py-5 rounded-3">
        <h4 className="fw-bold mb-3">📞 Contact SRMS</h4>
        <p className="text-secondary mb-0">We’re here to help you 24/7</p>
      </section>

    </Container>
  );
}