import React from "react";
import BaseButton from "./BaseButton";

function Today({ onClick, ...props }) {
  return (
    <BaseButton
      label="Bugün"
      onClick={onClick}
      variant="outlined"
      severity="secondary"
      size="medium"
      {...props}
    />
  );
}

export default Today;
