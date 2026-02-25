import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

export default function StudentLoginForm({ setLoggedUser }) {
  const API = process.env.REACT_APP_API_URL; // ✅ .env API

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedUser");
    if (savedUser) {
      try {
        setLoggedUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("loggedUser");
      }
    }
  }, [setLoggedUser]);

  // ================= LOGIN =================
  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/users/login`, { email, password }); // 🔥 updated
      setLoggedUser(res.data.user);
      localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
      setSuccess("🎉 Welcome back!");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(`${API}/users/send-otp`, { email: fpEmail }); // 🔥 updated
      setForgotStep("otp");
      setSuccess("📧 OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.error || "OTP sending failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    setError("");
    if (newPass !== confirmPass) return setError("Passwords do not match");
    if (newPass.length < 8) return setError("Min 8 characters required");

    setLoading(true);
    try {
      await axios.post(`${API}/users/reset-password`, { // 🔥 updated
        email: fpEmail,
        otp,
        newPassword: newPass,
      });
      setSuccess("✅ Password reset successful!");
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep("email");
        setFpEmail("");
        setOtp("");
        setNewPass("");
        setConfirmPass("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
      }}
    >
      <Card
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          border: "none",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Card.Body className="p-4">
          <h4 className="text-center fw-bold mb-3">
            {showForgot ? "🔐 Reset Password" : "🎓 Student Login"}
          </h4>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {!showForgot ? (
            <>
              <Form.Control
                className="mb-3"
                placeholder="📧 Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Form.Control
                className="mb-3"
                type="password"
                placeholder="🔑 Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                className="w-100 fw-semibold mb-2"
                style={{
                  background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px",
                }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "🚀 Login"}
              </Button>

              {/* ===== ADMIN & FACULTY LOGIN BUTTONS ===== */}
              <div className="d-grid gap-2 mb-3">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="fw-semibold py-2"
                  onClick={() => window.location.href = "https://student-management-system-1frantadmin.onrender.com"}
                >
                  🛡️ Admin Login
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="fw-semibold py-2"
                  onClick={() => window.location.href = "https://student-management-system-1franthod.onrender.com"}
                >
                  👨‍🏫 HOD Login
                </Button>
              </div>

              <Button
                variant="link"
                className="w-100 mt-2 fw-semibold"
                onClick={() => setShowForgot(true)}
              >
                ❓ Forgot Password?
              </Button>
            </>
          ) : (
            <>
              {forgotStep === "email" && (
                <>
                  <Form.Control
                    className="mb-3"
                    placeholder="Registered email"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                  />

                  <Button
                    className="w-100 fw-semibold"
                    style={{
                      background: "linear-gradient(135deg,#10b981,#34d399)",
                      border: "none",
                      borderRadius: 12,
                    }}
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "📧 Send OTP"}
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-100 mt-2"
                    onClick={() => setShowForgot(false)}
                  >
                    ← Back to Login
                  </Button>
                </>
              )}

              {forgotStep === "otp" && (
                <>
                  <div className="text-center mb-3 p-2 bg-light rounded">
                    <small className="text-muted">
                      OTP sent to <b>{fpEmail}</b>
                    </small>
                  </div>

                  <Form.Control
                    className="mb-2 text-center fs-4 fw-bold"
                    style={{ letterSpacing: "0.4em", height: 60, borderRadius: 12 }}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                  />

                  <Form.Control
                    className="mb-2"
                    type="password"
                    placeholder="New Password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />

                  <Form.Control
                    className="mb-3"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />

                  <Button
                    className="w-100 fw-semibold"
                    style={{
                      background: "linear-gradient(135deg,#10b981,#34d399)",
                      border: "none",
                      borderRadius: 12,
                    }}
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "🔐 Reset Password"}
                  </Button>

                  <Button
                    variant="link"
                    className="w-100 mt-2"
                    onClick={() => setForgotStep("email")}
                  >
                    ← Change Email
                  </Button>
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
