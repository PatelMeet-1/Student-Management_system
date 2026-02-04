import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function StudentLoginForm({ setLoggedUser, setError, setSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/users/login", { email, password });
      setLoggedUser(res.data);
      localStorage.setItem("loggedUser", JSON.stringify(res.data));
      setError("");
      setSuccess("");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!fpEmail || !oldPass || !newPass || !reNewPass) return setError("All fields required");
    if (newPass !== reNewPass) return setError("New passwords do not match");
    try {
      await axios.put("http://localhost:3000/api/users/password", {
        email: fpEmail,
        oldPassword: oldPass,
        newPassword: newPass,
      });
      setSuccess("Password updated successfully");
      setShowForgot(false);
      setFpEmail(""); setOldPass(""); setNewPass(""); setReNewPass("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
    }
  };

  return (
    <Card className="p-4 shadow mx-auto" style={{ maxWidth: "400px", borderRadius: "15px" }}>
      
     

      <h4 className="text-center mb-3">Student Login</h4>

      {!showForgot ? (
        <>
          <Form.Control className="mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Form.Control className="mb-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-100 mb-2" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }} onClick={handleLogin}>Login</Button>

          {/* ===== Admin Login Button ===== */}
          <Button
            variant="outline-primary"
            className="w-100 mb-2"
            onClick={() => window.location.href = "http://localhost:3001/admin/login"}
          >
            Admin Login
          </Button>

          <Button variant="link" className="w-100" onClick={() => setShowForgot(true)}>Forgot Password?</Button>
        </>
      ) : (
        <>
          <Form.Control className="mb-2" placeholder="Email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} />
          <Form.Control className="mb-2" type="password" placeholder="Old Password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
          <Form.Control className="mb-2" type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          <Form.Control className="mb-3" type="password" placeholder="Re-enter New Password" value={reNewPass} onChange={e => setReNewPass(e.target.value)} />
          <Button className="w-100 mb-2" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }} onClick={handlePasswordUpdate}>Update Password</Button>
          <Button variant="secondary" className="w-100" onClick={() => setShowForgot(false)}>Back to Login</Button>
        </>
      )}
    </Card>
  );
}
