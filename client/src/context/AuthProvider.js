import React, { createContext, useContext, useEffect, useState } from "react";
import API from "config/api.config";

// services
import { AuthService } from "services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agreement, setAgreement] = useState(false);

  const authenticate = ({ agreement }) => {
    setIsAuthenticated(true);
    setAgreement(agreement);
    setLoading(false);
  };

  const unauthenticate = () => {
    setIsAuthenticated(false);
    setAgreement(false);
    setLoading(false);
  };

  // Check if user is authenticated
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AuthService.permission({ signal })
      .then((res) => authenticate(res.data))
      .catch(() => unauthenticate());

    return () => {
      controller.abort();
    };
  }, []);

  // Check all api responses for 401 status and unauthenticate user
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.status === 401) {
        unauthenticate();
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        agreement,
        authenticate,
        unauthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
