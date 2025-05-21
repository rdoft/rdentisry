import React from "react";
import BaseButton from "./BaseButton";
import { useLoading } from "context/LoadingProvider";

function Subscribe({
  label,
  onClick,
  variant = "outlined",
  severity = "primary",
  size = "large",
  disabled,
  ...props
}) {
  const { loading } = useLoading();

  return (
    <BaseButton
      icon={"pi pi-arrow-right"}
      iconPos="right"
      label={label}
      onClick={onClick}
      variant={variant}
      severity={severity}
      size={size}
      disabled={disabled}
      loading={loading.save}
      style={{
        width: "100%",
        ...props.style,
      }}
      {...props}
    />
  );
}

export default Subscribe;
