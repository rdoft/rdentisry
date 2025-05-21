import React from "react";
import { Tooltip } from "@mui/material";
import BaseButton from "./BaseButton";

function Delete({
  label,
  onClick,
  variant = "text",
  severity = "danger",
  ...props
}) {
  if (label) {
    return (
      <BaseButton
        icon="pi pi-trash"
        variant={variant}
        severity={severity}
        label={label}
        onClick={onClick}
        {...props}
      />
    );
  } else {
    return (
      <Tooltip title="Sil" placement="bottom" enterDelay={750}>
        <span>
          <BaseButton
            icon="pi pi-trash"
            variant={variant}
            severity={severity}
            onClick={onClick}
            {...props}
          />
        </span>
      </Tooltip>
    );
  }
}

export default Delete;
