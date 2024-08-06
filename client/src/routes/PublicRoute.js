import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthProvider";
import { Loading } from "components/Other";

const PublicRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  } else if (isAuthenticated) {
    return <Navigate to="/" />;
  } else {
    return <Component {...rest} />;
  }
};

export default PublicRoute;
