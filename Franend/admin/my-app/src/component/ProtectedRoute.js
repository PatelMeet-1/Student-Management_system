import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const tokenKey = process.env.REACT_APP_ADMIN_TOKEN_KEY || "adminToken";
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
