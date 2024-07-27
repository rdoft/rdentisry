import React, { createContext, useContext, useEffect, useState } from "react";

// services
import { AuthService } from "services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const authenticated = () => {
    setIsAuthenticated(true);
    setLoading(false);
  };

  const unauthenticated = () => {
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Check if user is authenticated
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AuthService.permission({ signal })
      .then(() => authenticated())
      .catch(() => unauthenticated());

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ loading, isAuthenticated, authenticated, unauthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
