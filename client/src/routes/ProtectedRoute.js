import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthProvider";
import { Loading } from "components/Other";
import { UserAgreementDialog } from "components/Dialog";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, agreement, loading } = useAuth();

  if (loading) {
    return <Loading />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else if (!agreement) {
    return <UserAgreementDialog />;
  } else {
    return <Component {...rest} />;
  }
};

export default ProtectedRoute;
