import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const employee = JSON.parse(localStorage.getItem("employee") || "{}");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  if (employee?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
