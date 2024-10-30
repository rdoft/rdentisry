import React from "react";
import { Button } from "primereact";
import { useLoading } from "context/LoadingProvider";

// assets
import { useTheme } from "@mui/material/styles";

function Subscribe({ label, onClick, disabled, ...props }) {
  const theme = useTheme();
  const { loading } = useLoading();

  return (
    <Button
      outlined
      size="small"
      label={label}
      disabled={disabled || loading.save}
      icon={loading.save ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
      iconPos="right"
      onClick={onClick}
      style={{
        color: theme.palette.text.primary,
        opacity: disabled ? 0.5 : 1,
        border: `1px solid ${theme.palette.grey[300]}`,
        width: "100%",
        height: "3rem",
        fontSize: "1rem",
        ...props.style,
      }}
    />
  );
}

export default Subscribe;
