import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const role = decoded?.role;
    const path = location.pathname;

    // Prevent admin from accessing /dashboard/*
    if (role === "admin" && path.startsWith("/dashboard")) {
      return <Navigate to="/admin-dashboard" replace />;
    }

    // Prevent customer from accessing /admin-dashboard/*
    if (role === "customer" && path.startsWith("/admin-dashboard")) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
