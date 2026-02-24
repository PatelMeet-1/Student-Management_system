import React, { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";
import Loader from "./loader";

export default function FacultyLoginForm() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(0); // 0=login, 1=forgot, 2=reset
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    console.log("🔍 LOGIN:", cleanEmail);

    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/faculty/login/faculty`, {
  email: cleanEmail,
  password: cleanPassword,
});

      console.log("✅ SUCCESS:", res.data);
localStorage.setItem(
  process.env.REACT_APP_FACULTY_TOKEN_KEY,
  res.data.token
);     

localStorage.setItem("facultyData", JSON.stringify(res.data.faculty));
      
      setSuccess(`✅ Welcome ${res.data.faculty.name}!`);
      
      setTimeout(() => {
        window.location.href = "/faculty/dashboard";
      }, 1500);

    } catch (err) {
      console.error("💥 ERROR:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const cleanEmail = fpEmail.trim().toLowerCase();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/faculty/forgot-password`, {
  email: cleanEmail,
});
      setSuccess("✅ OTP sent! Check email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPass !== confirmPass) {
      setError("Passwords don't match");
      return;
    }
    if (newPass.length < 6) {
      setError("Password must be 6+ characters");
      return;
    }

    setError(""); setSuccess(""); setLoading(true);

    try {
      await axios.post(`${API_URL}/faculty/reset-password-otp`, {
  email: fpEmail.trim().toLowerCase(),
  otp: otp.trim(),
  newPassword: newPass,
});
      
      setSuccess("✅ Password reset! Login now.");
      setTimeout(() => {
        setStep(0);
        setEmail(fpEmail);
        setPassword("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
          {loading && <Loader />}   {/* 🔥 LOGIN / OTP / RESET ke time loader */}

      <Card className="p-4 shadow mx-auto" style={{ maxWidth: 420 }}>
        <h4 className="text-center mb-4 text-primary fw-bold">
          {step === 0 && "👨‍🏫 HOD Login"}
          {step === 1 && "📧 Forgot Password"}
          {step === 2 && "🔑 Reset Password"}
        </h4>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="mb-3">{success}</Alert>}

        {/* LOGIN */}
        {step === 0 && (
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 py-2 fw-bold" disabled={loading}
              style={{ background: "linear-gradient(45deg, #667eea, #764ba2)", border: "none" }}
            >
              {loading ? "🔄 Logging in..." : "🚀 Login"}
            </Button>

            <Button
              variant="link"
              className="w-100 p-0 mt-2 text-danger fw-semibold text-decoration-none"
              onClick={() => setStep(1)}
            >
              🔑 Forgot Password?
            </Button>
          </Form>
        )}

        {/* FORGOT PASSWORD */}
        {step === 1 && (
          <Form onSubmit={handleSendOTP}>
            <Form.Group className="mb-4">
              <Form.Label>HOD Email</Form.Label>
              <Form.Control
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 py-2 fw-bold mb-2" disabled={loading}
              style={{ background: "linear-gradient(45deg, #ff6b6b, #ee5a24)", border: "none" }}
            >
              {loading ? "📤 Sending..." : "📧 Send OTP"}
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100 py-2"
              onClick={() => { setStep(0); setError(""); }}
            >
              ← Back to Login
            </Button>
          </Form>
        )}

        {/* RESET PASSWORD */}
        {step === 2 && (
          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3">
              <Form.Label>OTP (6 digits)</Form.Label>
              <Form.Control
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 py-2 fw-bold mb-2" disabled={loading}
              style={{ background: "linear-gradient(45deg, #28a745, #20c997)", border: "none" }}
            >
              {loading ? "🔄 Resetting..." : "✅ Reset Password"}
            </Button>

            <div className="d-grid gap-2">
              <Button variant="outline-primary" size="sm" onClick={handleSendOTP} disabled={loading}>
                🔄 Resend OTP
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => setStep(0)}>
                ← Back to Login
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </Container>
  );
}
