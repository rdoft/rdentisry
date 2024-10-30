import React, { createContext, useState, useContext } from "react";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [pricing, setPricing] = useState(() => {
    const savedPricing = localStorage.getItem("pricing");
    return savedPricing ? JSON.parse(savedPricing) : null;
  });
  const [userDetail, setUserDetail] = useState(() => {
    const savedUserDetail = localStorage.getItem("userDetail");
    return savedUserDetail
      ? JSON.parse(savedUserDetail)
      : {
          idNumber: "",
          name: "",
          surname: "",
          phone: "",
          address: "",
          city: "",
          country: "Türkiye",
        };
  });

  const selectPricing = (pricing) => {
    localStorage.setItem("pricing", JSON.stringify(pricing));
    setPricing(pricing);
  };

  const saveUserDetail = (userDetail) => {
    localStorage.setItem("userDetail", JSON.stringify(userDetail));
    setUserDetail(userDetail);
  };

  return (
    <SubscriptionContext.Provider
      value={{ pricing, userDetail, selectPricing, saveUserDetail }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
