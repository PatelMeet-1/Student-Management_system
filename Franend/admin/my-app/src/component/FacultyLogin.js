import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FacultyLogin() {
  const API_URL = "http://localhost:3000/api/faculty"; // API for faculty

  // ================= LOGIN STATE =================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FORGOT PASSWORD STATE =================
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // ================= HANDLE LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email aur Password zaroori hai!");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Valid email enter karo!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      toast.success(`Welcome ${response.data.faculty.name}!`);

      // Token save karo localStorage mein
      localStorage.setItem("facultyToken", response.data.token);
      localStorage.setItem("facultyData", JSON.stringify(response.data.faculty));

      // 2 second baad redirect karo dashboard par
      setTimeout(() => {
        window.location.href = "/faculty-dashboard";
      }, 2000);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Login failed! Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE FORGOT PASSWORD =================
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error("Email enter karo!");
      return;
    }

    if (!forgotEmail.includes("@")) {
      toast.error("Valid email enter karo!");
      return;
    }

    setLoadingForgot(true);

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email: forgotEmail,
      });

      console.log("Forgot password response:", response.data);

      toast.success("Password reset link aapke email par bhej di gai!");
      setResetSent(true);

      // 3 second baad reset form ko close karo
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setResetSent(false);
      }, 3000);
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Email not found in our system."
      );
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <ToastContainer />

      {/* ================= LOGIN CARD ================= */}
      {!showForgotPassword ? (
        <div
          className="card shadow-lg"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          {/* ================= HEADER ================= */}
          <div
            className="card-header text-white text-center py-4"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            <h2 className="mb-0">🎓 Faculty Login</h2>
            <p className="text-light mb-0 small mt-2">
              Apne email aur password se login karo
            </p>
          </div>

          {/* ================= FORM BODY ================= */}
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              {/* ================= EMAIL INPUT ================= */}
              <div className="mb-3">
                <label className="form-label fw-bold">📧 Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* ================= PASSWORD INPUT ================= */}
              <div className="mb-3">
                <label className="form-label fw-bold">🔐 Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Apna password enter karo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* ================= FORGOT PASSWORD LINK ================= */}
              <div className="mb-3 text-end">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setEmail("");
                    setPassword("");
                  }}
                  disabled={loading}
                >
                  🔑 Password bhul gaye?
                </button>
              </div>

              {/* ================= LOGIN BUTTON ================= */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Login ho rahe ho...
                  </>
                ) : (
                  "✅ Login Karo"
                )}
              </button>
            </form>

            {/* ================= DIVIDER ================= */}
            <hr className="my-4" />

            {/* ================= INFO MESSAGE ================= */}
            <div className="alert alert-info" role="alert">
              <strong>Demo Credentials:</strong>
              <br />
              Email: faculty@gmail.com
              <br />
              Password: 123456
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="card-footer text-center py-3 bg-light">
            <p className="text-muted mb-0 small">
              © 2026 Faculty Management System
            </p>
          </div>
        </div>
      ) : (
        /* ================= FORGOT PASSWORD CARD ================= */
        <div
          className="card shadow-lg"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          {/* ================= HEADER ================= */}
          <div
            className="card-header text-white text-center py-4"
            style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}
          >
            <h2 className="mb-0">🔑 Password Reset</h2>
            <p className="text-light mb-0 small mt-2">
              Apna email enter karo password reset karne ke liye
            </p>
          </div>

          {/* ================= FORM BODY ================= */}
          <div className="card-body p-4">
            {!resetSent ? (
              <form onSubmit={handleForgotPassword}>
                {/* ================= EMAIL INPUT ================= */}
                <div className="mb-3">
                  <label className="form-label fw-bold">📧 Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Apna email enter karo"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={loadingForgot}
                  />
                </div>

                {/* ================= INFO TEXT ================= */}
                <div className="alert alert-warning" role="alert">
                  <small>
                    Ek password reset link aapke email par bhej di jayegi.
                    Email check karke link pe click karo.
                  </small>
                </div>

                {/* ================= BUTTON GROUP ================= */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg fw-bold"
                    disabled={loadingForgot}
                  >
                    {loadingForgot ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Bhej rahe ho...
                      </>
                    ) : (
                      "📧 Reset Link Bhejo"
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg fw-bold"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail("");
                    }}
                    disabled={loadingForgot}
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            ) : (
              /* ================= SUCCESS MESSAGE ================= */
              <div className="text-center py-4">
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  <h4 className="mb-2">✅ Success!</h4>
                  <p>
                    Password reset link aapke email par bhej di gai!
                    <br />
                    <strong>Apne email check karo aur link pe click karo.</strong>
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg fw-bold mt-3"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                    setResetSent(false);
                  }}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>

          {/* ================= FOOTER ================= */}
          <div className="card-footer text-center py-3 bg-light">
            <p className="text-muted mb-0 small">
              © 2026 Faculty Management System
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
