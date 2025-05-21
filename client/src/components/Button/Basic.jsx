import React from "react";
import BaseButton from "./BaseButton";

function Basic({
  label,
  onClick,
  icon,
  variant = "text",
  severity = "secondary",
  ...props
}) {
  if (label) {
    return (
      <BaseButton
        icon={icon}
        variant={variant}
        severity={severity}
        label={label}
        onClick={onClick}
        style={{
          width: "100%",
          textAlign: "start",
          ...props.style,
        }}
        {...props}
      />
    );
  } else {
    return (
      <BaseButton
        icon={icon}
        variant={variant}
        severity={severity}
        onClick={onClick}
        {...props}
      />
    );
  }
}

export default Basic;
