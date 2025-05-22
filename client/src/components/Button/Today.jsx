import React from "react";
import BaseButton from "./BaseButton";

function Today({ onClick, ...props }) {
  return (
    <BaseButton
      label="Bugün"
      onClick={onClick}
      variant="outlined"
      severity="secondary"
      size="small"
      {...props}
    />
  );
}

export default Today;
