import React, { createContext, useCallback, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({});
  /**
   *  fetch -> loading["ComponentName"]
   *  save  -> loading["save"]
   *  delete-> loading ["delete"]
   * */

  const startLoading = useCallback(
    (key) =>
      setLoading((prev) => ({
        ...prev,
        [key]: true,
      })),
    []
  );
  const stopLoading = useCallback(
    (key) =>
      setLoading((prev) => ({
        ...prev,
        [key]: false,
      })),
    []
  );

  return (
    <LoadingContext.Provider
      value={{
        loading: loading,
        startLoading: startLoading,
        stopLoading: stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
