import React, { useState, useEffect } from "react";
import { useLoading } from "context/LoadingProvider";

const DELAY_RENDER = 100; // 0.1 seconds

const LoadingController = ({ name, skeleton, children }) => {
  const { loading, timer } = useLoading();
  const [render, setRender] = useState(false);

  useEffect(() => {
    let delay;

    // If the loading state for the specified component is false,
    // set a delay before rendering the children
    if (!loading[name]) {
      delay = setTimeout(() => setRender(true), DELAY_RENDER);
    } else {
      // If still loading, reset the render state
      setRender(false);
    }

    // Clean up the timeout when the component unmounts or dependencies change
    return () => clearTimeout(delay);
  }, [loading, name]);

  // If loading is true and timer is active, return null (no rendering)
  if (loading[name] && timer[name]) {
    return null;
  }

  // If loading is true but timer is inactive, render the skeleton component
  if (loading[name] && !timer[name]) {
    return skeleton && <>{skeleton}</>;
  }

  // Render the children after the delay has passed and loading is false
  return render && <>{children}</>;
};

export default LoadingController;
