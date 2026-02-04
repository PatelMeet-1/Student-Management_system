import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";

export default function FacultyLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/faculty/login/faculty",
        { email, password }
      );

      if (res.data.success) {
        const loggedInFaculty = res.data.faculty;

        // Save faculty-specific data
        localStorage.setItem("facultyToken", res.data.token);
        localStorage.setItem("currentFacultyId", loggedInFaculty._id);
        localStorage.setItem("facultyData", JSON.stringify(loggedInFaculty));
        localStorage.setItem(
          "completeFacultyData",
          JSON.stringify(loggedInFaculty)
        );

        toast.success(`Welcome ${loggedInFaculty.name} 🎉`);
        setTimeout(() => navigate("/faculty-dashboard"), 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <ToastContainer />

      <div
        className="card p-4 shadow-lg border-0"
        style={{ width: "380px", borderRadius: "15px" }}
      >
        <div className="text-center mb-3">
          <FaUserTie size={45} className="text-primary mb-2" />
          <h4 className="fw-bold">Faculty Login</h4>
          <p className="text-muted mb-0">Login to your dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">© 2026 Faculty Portal</small>
        </div>
      </div>
    </div>
  );
}
