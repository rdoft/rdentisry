import React from "react";
import { Button } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function Add({ label, onClick, ...props }) {
  const theme = useTheme();

  return props.default ? (
    <Button
      size="small"
      icon="pi pi-key"
      label={label}
      onClick={onClick}
      style={{
        margin: "0 0.5rem",
        backgroundColor: theme.palette.text.secondary,
        ...props.style,
      }}
    />
  ) : (
    <Button
      text={props.border ? false : true}
      outlined
      size="small"
      icon="pi pi-key"
      label={label}
      onClick={onClick}
      style={{
        margin: "0 0.5rem",
        color: theme.palette.text.secondary,
        ...props.style,
      }}
    />
  );
}

export default Add;
