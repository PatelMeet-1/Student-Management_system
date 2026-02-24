import React, { useState, useEffect } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import StudentLoginForm from "./StudentLoginForm";
import StudentDetails from "./StudentDetails";
import InternalExamResult from "./InternalExamResult";
import PracticalExamResult from "./PracticalExamResult";
import UniversityResult from "./UniversityResult";
import Circular from "./Circular";
import TimeTable from "./TimeTable";
import "./StudentLoginResult.css";

export default function StudentLoginResult() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [activeView, setActiveView] = useState("internal"); // internal | practical | university | circular | assignment | timetable | details
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load logged user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedUser");
    if (savedUser) setLoggedUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    setError("");
    setSuccess("");
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (view) => {
    setActiveView(view);
    setSidebarOpen(false); // Close sidebar after selecting a menu item on mobile
  };

  return (
    <Container fluid className="p-0">
      {!loggedUser ? (
        <StudentLoginForm
          setLoggedUser={setLoggedUser}
          setError={setError}
          setSuccess={setSuccess}
        />
      ) : (
        <div className="dashboard-container">
          {/* TOGGLE BUTTON - Mobile Only */}
          <Button
            variant="dark"
            className="toggle-sidebar-btn d-md-none"
            onClick={toggleSidebar}
            style={{ position: "fixed", top: "15px", left: "15px", zIndex: 999 }}
          >
            ☰
          </Button>

          {/* OVERLAY - Mobile Only */}
          {sidebarOpen && (
            <div
              className="sidebar-overlay d-md-none"
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 998,
              }}
            />
          )}

          {/* SIDEBAR */}
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h5 className="mb-4">Welcome, {loggedUser.name}</h5>
            <div className="d-flex flex-column gap-2">
              <Button
                variant={activeView === "internal" ? "primary" : "outline-light"}
                className="w-100 text-start"
                onClick={() => handleMenuClick("internal")}
              >
                📋 Internal Exam
              </Button>
              <Button
                variant={activeView === "practical" ? "primary" : "outline-light"}
                className="w-100 text-start"
                onClick={() => handleMenuClick("practical")}
              >
                🔧 Practical Exam
              </Button>
              <Button
                variant={activeView === "university" ? "primary" : "outline-light"}
                className="w-100 text-start"
                onClick={() => handleMenuClick("university")}
              >
                🎓 University Result
              </Button>
              <Button
                variant={activeView === "circular" ? "primary" : "outline-light"}
                className="w-100 text-start"
                onClick={() => handleMenuClick("circular")}
              >
                📢 Circular
              </Button>

              <Button
                variant={activeView === "timetable" ? "primary" : "outline-light"}
                className="w-100 text-start"
                onClick={() => handleMenuClick("timetable")}
              >
                ⏰ Time Table
              </Button>
              <Button
                variant={activeView === "details" ? "primary" : "outline-light"}
                className="w-100 text-start"
                onClick={() => handleMenuClick("details")}
              >
                👤 Student Details
              </Button>
            </div>
            <Button
              variant="danger"
              className="w-100 mt-4"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* MAIN CONTENT */}
          <div className="main-content">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {activeView === "internal" ? (
              <InternalExamResult loggedUser={loggedUser} setError={setError} />
            ) : activeView === "practical" ? (
              <PracticalExamResult loggedUser={loggedUser} setError={setError} />
            ) : activeView === "university" ? (
              <UniversityResult loggedUser={loggedUser} setError={setError} />
            ) : activeView === "circular" ? (
              <Circular loggedUser={loggedUser} setError={setError} />
            ) : activeView === "timetable" ? (
              <TimeTable loggedUser={loggedUser} setError={setError} />
            ) : (
              <StudentDetails
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
                setError={setError}
                setSuccess={setSuccess}
              />
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
