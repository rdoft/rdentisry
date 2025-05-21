import React from "react";
import { Tooltip } from "@mui/material";
import BaseButton from "./BaseButton";

function Read({
  label,
  onClick,
  variant = "text",
  severity = "primary",
  ...props
}) {
  return (
    <Tooltip title="Okundu yap" placement="bottom" enterDelay={500}>
      <BaseButton
        icon="pi pi-check-circle"
        label={label}
        variant={variant}
        severity={severity}
        onClick={onClick}
        {...props}
      />
    </Tooltip>
  );
}

export default Read;
