import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function StudentLoginForm({ setLoggedUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // 'email', 'otp', 'reset'
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [oldPass, setOldPass] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= CHECK IF ALREADY LOGGED IN =================
  useEffect(() => {
    const checkLogin = () => {
      const savedUser = localStorage.getItem("loggedUser");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setLoggedUser(user);
        } catch (err) {
          localStorage.removeItem("loggedUser");
        }
      }
    };
    checkLogin();
  }, [setLoggedUser]);

  // ================= LOGIN - SAB DETAILS LAATA HAI ✅ =================
  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      // ✅ SAB DETAILS mil gayi!
      console.log("✅ FULL USER DATA:", res.data.user);
      
      setLoggedUser(res.data.user); // Complete user object
      localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
      setSuccess("✅ Login successful! Welcome back!");
      
      // Clear fields after success
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
      const res = await axios.post("http://localhost:3000/api/users/send-otp", {
        email: fpEmail,
      });

      setSuccess("✅ OTP sent! Check your email (valid 5 mins)");
      setForgotStep("otp");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD WITH OTP =================
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!otp || !newPass || !confirmPass) {
      return setError("Fill all fields");
    }
    if (newPass !== confirmPass) {
      return setError("Passwords don't match");
    }
    if (newPass.length < 8) {
      return setError("Password must be 8+ characters");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/users/reset-password", {
        email: fpEmail,
        otp,
        newPassword: newPass,
      });

      setSuccess("✅ Password reset! Login with new password");
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

  // ================= OLD PASSWORD CHANGE (Optional) =================
  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");

    if (!fpEmail || !oldPass || !newPass || !confirmPass) {
      return setError("All fields required");
    }
    if (newPass !== confirmPass) {
      return setError("Passwords don't match");
    }

    setLoading(true);
    try {
      await axios.put("http://localhost:3000/api/users/password", {
        email: fpEmail,
        oldPassword: oldPass,
        newPassword: newPass,
      });

      setSuccess("✅ Password updated!");
      setShowForgot(false);
      setFpEmail("");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow mx-auto" style={{ maxWidth: 400, borderRadius: 15 }}>
      <h4 className="text-center fw-bold mb-3">
        {showForgot ? "🔐 Password Reset" : "🎓 Student Login"}
      </h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!showForgot ? (
        <>
          {/* LOGIN FORM */}
          <Form.Control
            className="mb-2"
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
            className="w-100 mb-2 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "🚀 Login"}
          </Button>

          {/* OTHER LOGINS */}
         

          <Button variant="link" className="w-100" onClick={() => setShowForgot(true)}>
            ❓ Forgot Password?
          </Button>
        </>
      ) : (
        <>
          {/* OTP RESET FLOW */}
          {forgotStep === "email" && (
            <>
              <Form.Control
                className="mb-3"
                placeholder="Enter registered email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
              />
              <Button
                className="w-100 mb-2 fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  border: "none",
                }}
                onClick={handleSendOtp}
                disabled={loading || !fpEmail}
              >
                {loading ? "⏳ Sending..." : "📧 Send OTP"}
              </Button>
              <Button
                variant="secondary"
                className="w-100"
                onClick={() => setShowForgot(false)}
              >
                ← Back to Login
              </Button>
            </>
          )}

          {forgotStep === "otp" && (
            <>
              <div className="text-center mb-3 p-3 bg-light rounded">
                <div className="mb-2">
                  <strong>📧 {fpEmail}</strong>
                </div>
                <small className="text-muted">Enter 6-digit OTP from email</small>
              </div>

              <Form.Control
                className="mb-2 text-center fs-3 fw-bold"
                style={{ letterSpacing: "0.3em", height: "70px" }}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                maxLength={6}
              />

              <Form.Control
                className="mb-2"
                type="password"
                placeholder="New Password (8+ chars)"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />

              <Form.Control
                className="mb-3"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />

              <Button
                className="w-100 mb-2 fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  border: "none",
                }}
                onClick={handleResetPassword}
                disabled={loading || otp.length !== 6 || !newPass || !confirmPass}
              >
                {loading ? "⏳ Resetting..." : "🔐 Reset Password"}
              </Button>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-success"
                  className="flex-fill fw-semibold"
                  size="sm"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  🔄 Resend OTP
                </Button>
                <Button
                  variant="secondary"
                  className="flex-fill fw-semibold"
                  size="sm"
                  onClick={() => {
                    setForgotStep("email");
                    setOtp("");
                    setNewPass("");
                    setConfirmPass("");
                  }}
                >
                  ← Back
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}
