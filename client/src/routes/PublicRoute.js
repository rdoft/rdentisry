import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthProvider";
import { usePaymentContext } from "context/PaymentProvider";
import { Loading } from "components/Other";

// services
import { SubscriptionService } from "services";

const PublicRoute = ({ element: Component, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { pricing, selectPricing } = usePaymentContext();

  const pricingRef = useRef(selectPricing);
  // Set the pricing to the context
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pricingName = params.get("pricing");

    if (pricingName) {
      const controller = new AbortController();
      const signal = controller.signal;

      SubscriptionService.getPricings({ signal })
        .then((response) => {
          const pricing = response.data?.find(
            (item) => item.name === pricingName
          );
          if (pricing) {
            pricingRef.current(pricing);
          }
        })
        .catch((error) => {
          error.message && toast.error(error.message);
        });

      return () => {
        controller.abort();
      };
    }
  }, [location.search]);

  if (loading) {
    return <Loading />;
  } else if (isAuthenticated) {
    if (pricing) {
      return <Navigate to="/checkout" />;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Component {...rest} />;
  }
};

export default PublicRoute;
