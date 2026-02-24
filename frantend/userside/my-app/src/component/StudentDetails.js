import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentDetails({
  loggedUser,
  setLoggedUser,
  setError,
  setSuccess,
}) {
  const [studentDetails, setStudentDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users");

        const student = res.data.find(
          (u) => String(u._id) === String(loggedUser._id)
        );

        if (!student) {
          toast.error("Student not found", { autoClose: 3000 });
          setError("Student not found");
          return;
        }

        setStudentDetails(student);
        setEditEmail(student.email || "");
        setEditContact(student.contact || "");
      } catch (err) {
        toast.error("Server error", { autoClose: 3000 });
        setError("Server error");
      }
    };

    if (loggedUser?._id) fetchDetails();
  }, [loggedUser, setError]);

  const handleUpdateDetails = async () => {
    try {
      if (!editEmail || !editContact) {
        toast.warning("Email and Contact required", {
          autoClose: 2500,
        });
        return;
      }

      const formData = new FormData();
      formData.append("email", editEmail);
      formData.append("contact", editContact);
      if (editPhoto) formData.append("photo", editPhoto);

      const res = await axios.put(
        `http://localhost:3000/api/users/${loggedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStudentDetails(res.data);
      setLoggedUser(res.data);
      localStorage.setItem("loggedUser", JSON.stringify(res.data));

      setIsEditing(false);
      setEditPhoto(null);
      toast.success("✅ Details updated successfully!", {
        autoClose: 3000,
      });
      setSuccess("Details updated successfully");
      setError("");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Failed to update details: " + (err.response?.data?.error || err.message), {
        autoClose: 3000,
      });
      setError("Failed to update details");
    }
  };

  if (!studentDetails)
    return (
      <>
        <ToastContainer />
        <Card className="p-4 shadow text-center">
          <p>Loading student details...</p>
        </Card>
      </>
    );

  return (
    <>
      {/* ✅ ONLY TIMING TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />

      <Card className="p-4 shadow">
        {!isEditing ? (
          <>
            {/* PHOTO SECTION */}
            <div className="mb-4 text-center">
              {studentDetails.photo ? (
                <img
                  src={`http://localhost:3000${studentDetails.photo}`}
                  alt="Student"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #007bff",
                    boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    backgroundColor: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: "#6c757d",
                  }}
                >
                  👤
                </div>
              )}
            </div>

            {/* DETAILS DISPLAY */}
            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-6 mb-3 mb-md-0">
                <p className="text-muted small mb-1">Full Name</p>
                <p className="fw-bold text-dark">{studentDetails.name || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Age</p>
                <p className="fw-bold text-dark">{studentDetails.age || "N/A"}</p>
              </div>
            </div>

            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-6 mb-3 mb-md-0">
                <p className="text-muted small mb-1">📧 Email Address</p>
                <p className="fw-bold text-dark">{studentDetails.email || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">📱 Contact Number</p>
                <p className="fw-bold text-dark">{studentDetails.contact || "N/A"}</p>
              </div>
            </div>

            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-6 mb-3 mb-md-0">
                <p className="text-muted small mb-1">Enrollment Number</p>
                <p className="fw-bold text-dark">{studentDetails.EnrollmentNo || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Course</p>
                <p className="fw-bold text-dark">{studentDetails.course || "N/A"}</p>
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-100"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Details
            </Button>
          </>
        ) : (
          <>
            <h5 className="mb-4">Update Your Details</h5>

            {/* Photo Preview */}
            {editPhoto && (
              <div className="mb-4 p-3 bg-light rounded text-center">
                <p className="text-muted small mb-2">Photo Preview:</p>
                <img
                  src={URL.createObjectURL(editPhoto)}
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #28a745",
                  }}
                />
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📷 Upload Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditPhoto(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                PNG, JPG or GIF (Max 2 MB)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📧 Email Address</Form.Label>
              <Form.Control
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📱 Contact Number</Form.Label>
              <Form.Control
                type="tel"
                value={editContact}
                onChange={(e) => setEditContact(e.target.value)}
                placeholder="Enter your contact number"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="success"
                className="flex-grow-1"
                onClick={handleUpdateDetails}
              >
                ✅ Save Changes
              </Button>
              <Button
                variant="secondary"
                className="flex-grow-1"
                onClick={() => {
                  setIsEditing(false);
                  setEditPhoto(null);
                  setEditEmail(studentDetails.email || "");
                  setEditContact(studentDetails.contact || "");
                }}
              >
                ❌ Cancel
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
