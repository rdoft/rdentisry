import React from "react";
import BaseButton from "./BaseButton";

function More({ label, onClick, variant = "outlined", ...props }) {
  return (
    <BaseButton
      icon={props.icon || "pi pi-ellipsis-v"}
      label={label}
      onClick={onClick}
      variant={variant}
      style={{
        ...props.style,
      }}
      {...props}
    />
  );
}

export default More;
