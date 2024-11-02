import React, { useEffect } from "react";
import { useLoading } from "context/LoadingProvider";

function PaymentForm({ content }) {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading("PaymentForm");

    if (content) {
      const checkoutFormDiv = document.getElementById("iyzipay-checkout-form");

      // Parse the content into a temporary div
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      // Find all scripts and add them manually to ensure execution
      const scripts = tempDiv.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const newScript = document.createElement("script");

        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.innerHTML;
        }

        // Append the script directly below the checkout form div
        checkoutFormDiv.appendChild(newScript);
      }

      // Set the inner HTML without script tags
      checkoutFormDiv.innerHTML = tempDiv.innerHTML;
    }
    stopLoading("PaymentForm");

    // Cleanup function to run on unmount
    return () => {
      window.location.reload();
    };
  }, [content, startLoading, stopLoading]);

  return <div id="iyzipay-checkout-form" className="responsive"></div>;
}

export default PaymentForm;
