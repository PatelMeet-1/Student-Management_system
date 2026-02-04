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
      formData.append("userId", loggedUser._id);
      formData.append("email", editEmail);
      formData.append("contact", editContact);
      if (editPhoto) formData.append("photo", editPhoto);

      const res = await axios.put(
        "http://localhost:3000/api/users/student-details",
        formData
      );

      setStudentDetails(res.data.user);
      setLoggedUser(res.data.user);
      localStorage.setItem("loggedUser", JSON.stringify(res.data.user));

      setIsEditing(false);
      toast.success("Details updated successfully", {
        autoClose: 3000,
      });
      setSuccess("Details updated successfully");
      setError("");
    } catch (err) {
      toast.error("Failed to update details", {
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
            {/* PHOTO */}
            <div className="mb-3 text-center">
              {studentDetails.photo && (
                <img
                  src={`http://localhost:3000${studentDetails.photo}`}
                  alt="Student"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            {/* DETAILS */}
            <p><b>Name:</b> {studentDetails.name}</p>
            <p><b>Age:</b> {studentDetails.age}</p>
            <p><b>Email:</b> {studentDetails.email}</p>
            <p><b>Contact:</b> {studentDetails.contact}</p>

            <p>
              <b>Enrollment No:</b>{" "}
              {studentDetails.EnrollmentNo || "N/A"}
            </p>

            <Button onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          </>
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Upload Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setEditPhoto(e.target.files[0])
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={editContact}
                onChange={(e) =>
                  setEditContact(e.target.value)
                }
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button onClick={handleUpdateDetails}>
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
