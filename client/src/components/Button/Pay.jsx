import React from "react";
import { useLoading } from "context/LoadingProvider";
import BaseButton from "./BaseButton";

function Pay({
  label,
  onClick,
  variant = "text",
  severity = "primary",
  ...props
}) {
  const { loading } = useLoading();

  return (
    <BaseButton
      icon="pi pi-credit-card"
      variant={variant}
      severity={severity}
      loading={loading.save}
      label={!loading.save ? label : ""}
      onClick={onClick}
      {...props}
    />
  );
}

export default Pay;
