import React from "react";
import { Tooltip } from "@mui/material";
import BaseButton from "./BaseButton";

function Edit({
  label,
  onClick,
  variant = "text",
  severity = "secondary",
  ...props
}) {
  if (label) {
    return (
      <BaseButton
        icon="pi pi-external-link"
        variant={variant}
        severity={severity}
        label={label}
        onClick={onClick}
        {...props}
      />
    );
  } else {
    return (
      <Tooltip title="Görüntüle / Düzenle" placement="bottom" enterDelay={750}>
        <span>
          <BaseButton
            icon="pi pi-external-link"
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

export default Edit;
