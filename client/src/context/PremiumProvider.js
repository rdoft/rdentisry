import React, { createContext, useContext, useState } from "react";
import API from "config/api.config";

const PremiumContext = createContext();

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const showPremium = () => {
    setIsPremium(true);
  };

  const hidePremium = () => {
    setIsPremium(false);
  };

  // Check all api responses for 402 status and show premium modal
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.status === 402) {
        showPremium();
      }
      return Promise.reject(error);
    }
  );

  return (
    <PremiumContext.Provider value={{ isPremium, showPremium, hidePremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => useContext(PremiumContext);
