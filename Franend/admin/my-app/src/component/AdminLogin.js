import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  // ===== LOGIN STATES =====
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ===== FORGOT STATES =====
  const [showForgot, setShowForgot] = useState(false);
  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fpMsg, setFpMsg] = useState("");
  const [fpError, setFpError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/login",
        { username, password }
      );
      localStorage.setItem("adminToken", res.data.token);
      navigate("/students", { replace: true });
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  // ===== CHANGE USERNAME =====
  const handleChangeUsername = async () => {
    setFpError("");
    setFpMsg("");
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/admin/change-username", {
        oldUsername,
        newUsername,
      });
      setFpMsg("✅ Username updated successfully");
      setOldUsername("");
      setNewUsername("");
    } catch (err) {
      setFpError(
        err.response?.data?.message || "❌ Username update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== CHANGE PASSWORD =====
  const handleChangePassword = async () => {
    setFpError("");
    setFpMsg("");
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/admin/change-password", {
        username: oldUsername || username,
        oldPassword,
        newPassword,
      });
      setFpMsg("✅ Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setFpError(
        err.response?.data?.message || "❌ Password update failed"
      );
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
      {/* ===== LOGIN CARD ===== */}
      <div
        className="card shadow-lg p-4"
        style={{ width: 380, borderRadius: 15, border: "none" }}
      >
        {/* HEADER */}
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
            Login
          </button>

          <button
            type="button"
            className="btn btn-outline-primary w-100 fw-bold mt-3"
            style={{ borderRadius: 10 }}
            onClick={() => (window.location.href = "http://localhost:3002/")}
          >
            User Login
          </button>
        </form>

        <div
          className="text-center mt-3 text-muted"
          style={{ fontSize: 13 }}
        >
          © {new Date().getFullYear()} SRMS Admin Panel
        </div>
      </div>

      {/* ===== FORGOT MODAL ===== */}
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
                  onClick={() => setShowForgot(false)}
                ></button>
              </div>

              <div className="modal-body">
                {fpError && (
                  <div className="alert alert-danger py-2">{fpError}</div>
                )}
                {fpMsg && (
                  <div className="alert alert-success py-2">{fpMsg}</div>
                )}

                {/* CHANGE USERNAME */}
                <label className="fw-semibold">Old Username</label>
                <input
                  className="form-control mb-2"
                  value={oldUsername}
                  onChange={(e) => setOldUsername(e.target.value)}
                  placeholder="Old Username"
                />
                <label className="fw-semibold">New Username</label>
                <input
                  className="form-control mb-3"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="New Username"
                />
                <button
                  type="button"
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleChangeUsername}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Username"}
                </button>

                {/* CHANGE PASSWORD */}
                <label className="fw-semibold">Old Password</label>
                <input
                  type="password"
                  className="form-control mb-2"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                />
                <label className="fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control mb-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForgot(false)}
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
