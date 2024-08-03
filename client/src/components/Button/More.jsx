import React from "react";
import { Button } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function More({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Button
      text
      size="small"
      icon="pi pi-ellipsis-h"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={{
        color: theme.palette.text.secondary,
        ...props.style,
      }}
    />
  );
}

export default More;
