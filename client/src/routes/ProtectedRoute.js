import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthProvider";
import { usePaymentContext } from "context/PaymentProvider";
import { Loading } from "components/Other";
import { UserAgreementDialog } from "components/Dialog";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated, agreement, loading } = useAuth();
  const { pricing } = usePaymentContext();

  if (loading) {
    return <Loading />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else if (!agreement) {
    return <UserAgreementDialog />;
  } else if (pricing && location.pathname !== "/checkout") {
    return <Navigate to="/checkout" />;
  } else {
    return <Component {...rest} />;
  }
};

export default ProtectedRoute;
