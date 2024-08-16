import React from "react";
import { useLoading } from "context/LoadingProvider";

const LoadController = ({ name, skeleton, children }) => {
  const { loading, timer } = useLoading();

  if (loading[name] && timer[name]) {
    return null;
  }

  if (loading[name] && !timer[name]) {
    return skeleton && <>{skeleton}</>;
  }

  return <>{children}</>;
};

export default LoadController;
