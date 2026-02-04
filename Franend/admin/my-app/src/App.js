import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./component/AdminLogin";
// import Registration from "./component/admind"; // main page
import ProtectedRoute from "./component/ProtectedRoute";
import Main from "./component/dashboard/Main";


function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Main Page */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App;
