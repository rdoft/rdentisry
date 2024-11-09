import React, { createContext, useContext, useEffect, useState } from "react";

// services
import { SubscriptionService } from "services";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [limits, setLimits] = useState({
    doctors: 0,
    patients: 0,
    storage: 0,
    sms: 0,
  });

  const subscribe = (limits) => {
    setIsSubscribed(true);
    setLimits({
      doctors: limits.doctors,
      patients: limits.patients,
      storage: limits.storage,
      sms: limits.sms,
    });
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
    setLimits({
      doctors: 0,
      patients: 0,
      storage: 0,
      sms: 0,
    });
  };

  const showDialog = () => {
    setDialog(true);
  };

  const hideDialog = () => {
    setDialog(false);
  };

  // Check if user has a subscription
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    SubscriptionService.getSubscription({ signal })
      .then((res) => subscribe(res.data))
      .catch(() => unsubscribe())
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  // Refresh the subscription status and limits
  const refresh = () => {
    setLoading(true);
    SubscriptionService.getSubscription()
      .then((res) => subscribe(res.data))
      .catch(() => unsubscribe())
      .finally(() => setLoading(false));
  };

  return (
    <SubscriptionContext.Provider
      value={{
        loading,
        dialog,
        limits,
        isSubscribed,
        subscribe,
        unsubscribe,
        refresh,
        showDialog,
        hideDialog,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
