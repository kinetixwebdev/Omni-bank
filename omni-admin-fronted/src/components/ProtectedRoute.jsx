import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading indicator while checking authentication
  if (loading) {
    return (
      <div className=" flex items-center justify-center w-full h-screen">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (user == null) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected routes
  return <Outlet />;
};

export default ProtectedRoute;
