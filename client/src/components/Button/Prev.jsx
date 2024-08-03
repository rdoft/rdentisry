import React from "react";
import { Button } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function Prev({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Button
      text
      size="small"
      icon="pi pi-angle-left"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={{
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.primary,
        padding: "0.5rem",
        ...props.style,
      }}
    />
  );
}

export default Prev;
