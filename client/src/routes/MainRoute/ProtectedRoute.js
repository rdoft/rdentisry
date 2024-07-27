import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "routes/AuthProvider";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <i
        className="pi pi-spin pi-spinner-dotted"
        style={{ fontSize: "2rem" }}
      ></i>
    );
  }
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
