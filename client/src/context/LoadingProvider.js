import React, { createContext, useCallback, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({
    fetch: false,
    save: false,
    delete: false,
  });

  const startFetch = useCallback(
    () => setLoading((prev) => ({ ...prev, fetch: true })),
    []
  );
  const stopFetch = useCallback(
    () => setLoading((prev) => ({ ...prev, fetch: false })),
    []
  );

  const startSave = () => setLoading({ ...loading, save: true });
  const stopSave = () => setLoading({ ...loading, save: false });

  const startDelete = () => setLoading({ ...loading, delete: true });
  const stopDelete = () => setLoading({ ...loading, delete: false });

  return (
    <LoadingContext.Provider
      value={{
        loading: loading,
        startFetch: startFetch,
        stopFetch: stopFetch,
        startSave: startSave,
        stopSave: stopSave,
        startDelete: startDelete,
        stopDelete: stopDelete,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
