import React from "react";
import BaseButton from "./BaseButton";

function Cancel({
  label,
  onClick,
  variant = "text",
  severity = "secondary",
  size = "small",
  ...props
}) {
  return (
    <BaseButton
      icon="pi pi-times"
      variant={variant}
      severity={severity}
      label={label}
      onClick={onClick}
      size={size}
      {...props}
    />
  );
}

export default Cancel;
