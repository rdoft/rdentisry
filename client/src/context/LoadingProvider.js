import React, { createContext, useCallback, useContext, useState } from "react";

const LoadingContext = createContext();
const DELAY = 500;

export const LoadingProvider = ({ children }) => {
  /**
   *  fetch -> loading["ComponentName"]
   *  save  -> loading["save"]
   *  delete-> loading ["delete"]
   * */
  const [loading, setLoading] = useState({});
  const [timer, setTimer] = useState({});

  /**
   * Sets the loading state to true
   * Starts a timer. The timer is set to null after the specified delay.
   */
  const startLoading = useCallback((key) => {
    // Set loading
    setLoading((prev) => ({
      ...prev,
      [key]: true,
    }));

    // Set timer
    const _timer = setTimeout(() => {
      setTimer((prev) => ({
        ...prev,
        [key]: null,
      }));
    }, DELAY);
    setTimer((prev) => ({
      ...prev,
      [key]: _timer,
    }));
  }, []);

  /**
   * Sets the loading state to false
   * Clears the timer
   */
  const stopLoading = useCallback((key) => {
    // Set loading as false
    setLoading((prev) => ({
      ...prev,
      [key]: false,
    }));

    // Clear timer
    setTimer((prev) => ({
      ...prev,
      [key]: prev[key] ? clearTimeout(prev[key]) : null,
    }));
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        timer: timer,
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
