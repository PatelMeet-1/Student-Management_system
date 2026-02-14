import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./loader"; // import upar


export default function AdminLogin() {
  const navigate = useNavigate();

  // ===== LOGIN STATES =====
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ===== FORGOT / OTP STATES =====
  const [showForgot, setShowForgot] = useState(false);
  const [fpError, setFpError] = useState("");
  const [fpMsg, setFpMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== OTP RESET =====
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassOTP, setNewPassOTP] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpError, setOtpError] = useState("");

 
 // ===== LOGIN =====
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true); // loader start
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, {
      username,
      password,
    });
    const tokenKey = process.env.REACT_APP_ADMIN_TOKEN_KEY || "adminToken";
    localStorage.setItem(tokenKey, res.data.token);
    navigate("/students", { replace: true });
  } catch (err) {
    setError("Invalid username or password");
  } finally {
    setLoading(false); // loader stop
  }
};


  // ===== SEND OTP =====
  const handleSendOTP = async () => {
    setOtpError("");
    setOtpMsg("");
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/send-otp`, { email });
      setOtpMsg("✅ OTP sent to your email");
      setShowOTP(true);
    } catch (err) {
      setOtpError(err.response?.data?.message || "❌ OTP sending failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== VERIFY OTP & RESET PASSWORD / USERNAME =====
  const handleVerifyOTP = async () => {
    setOtpError("");
    setOtpMsg("");
    setLoading(true);
    try {
      // Build body dynamically based on what user entered
      const body = { email, otp };
      if (newUsername.trim() !== "") body.newUsername = newUsername;
      if (newPassOTP.trim() !== "") body.newPassword = newPassOTP;

      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/reset-username-password`,
        body
      );

      setOtpMsg("✅ Account updated successfully");
      
      // Reset all form fields
      setEmail("");
      setOtp("");
      setNewPassOTP("");
      setNewUsername("");
      
      // Close modal after 1.5 seconds and show login page
      setTimeout(() => {
        setShowForgot(false);
        setShowOTP(false);
        setFpError("");
        setFpMsg("");
      }, 1500);
    } catch (err) {
      setOtpError(err.response?.data?.message || "❌ OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
          {loading && <Loader />} {/* loader tabhi show hoga jab loading true ho */}

      {/* ===== LOGIN CARD ===== */}
      <div
        className="card shadow-lg p-4"
        style={{ width: 380, borderRadius: 15, border: "none" }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: 70,
              height: 70,
              background: "#667eea",
              borderRadius: "50%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            A
          </div>
          <h3 className="mt-3 fw-bold">Admin Login</h3>
          <p className="text-muted mb-0">Student Result Management System</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ borderRadius: 10 }}
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: 10 }}
            />
          </div>

          <div className="text-end mb-3">
            <small
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowForgot(true)}
            >
              Forgot Username / Password?
            </small>
          </div>

          <button
            type="submit"
            className="btn w-100 text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: 10,
            }}
          >
            Admin Login
          </button>
        </form>

        <div className="text-center mt-3 text-muted" style={{ fontSize: 13 }}>
          © {new Date().getFullYear()} SRMS Admin Panel
        </div>
      </div>

      {/* ===== FORGOT / OTP MODAL ===== */}
      {showForgot && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Update Username / Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowForgot(false);
                    setShowOTP(false);
                  }}
                ></button>
              </div>

              <div className="modal-body">
                {/* STEP 1 → SEND OTP */}
                {!showOTP && (
                  <>
                    {fpError && (
                      <div className="alert alert-danger py-2">{fpError}</div>
                    )}
                    {fpMsg && (
                      <div className="alert alert-success py-2">{fpMsg}</div>
                    )}

                    <label className="fw-semibold">Registered Email</label>
                    <input
                      type="email"
                      className="form-control mb-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter registered email"
                    />
                    <button
                      type="button"
                      className="btn btn-warning w-100 mb-3"
                      onClick={handleSendOTP}
                      disabled={loading || !email}
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </>
                )}

                {/* STEP 2 → VERIFY OTP + RESET */}
                {showOTP && (
                  <>
                    {otpError && (
                      <div className="alert alert-danger py-2">{otpError}</div>
                    )}
                    {otpMsg && (
                      <div className="alert alert-success py-2">{otpMsg}</div>
                    )}

                    <label className="fw-semibold">OTP</label>
                    <input
                      className="form-control mb-2"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />

                    <label className="fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control mb-2"
                      value={newPassOTP}
                      onChange={(e) => setNewPassOTP(e.target.value)}
                      placeholder="Enter new password"
                    />

                    <label className="fw-semibold">New Username (Optional)</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter new username"
                    />

                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={handleVerifyOTP}
                      disabled={loading || (!newPassOTP && !newUsername)}
                    >
                      {loading ? "Updating..." : "Verify & Update"}
                    </button>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForgot(false);
                    setShowOTP(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
