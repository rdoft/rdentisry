import React, { useEffect } from "react";

// TODO: set the fail and succes urls
function CheckoutForm({ content }) {
  useEffect(() => {
    // Insert the İyzico checkout form content into the div
    if (content) {
      document.getElementById("iyzipay-checkout-form").innerHTML = content;
    }
  }, [content]);

  return <div id="iyzipay-checkout-form" className="responsive"></div>;
}

export default CheckoutForm;
