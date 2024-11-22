import React, { createContext, useState, useContext } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
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

  const clearPricing = () => {
    localStorage.removeItem("pricing");
    setPricing(null);
  };

  const saveUserDetail = (userDetail) => {
    localStorage.setItem("userDetail", JSON.stringify(userDetail));
    setUserDetail(userDetail);
  };

  return (
    <PaymentContext.Provider
      value={{
        pricing,
        userDetail,
        selectPricing,
        clearPricing,
        saveUserDetail,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);
