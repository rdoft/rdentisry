import React from "react";
import { Button } from "primereact";
import { useTheme } from "@mui/material/styles";

function Copy({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Button
      outlined
      size="small"
      icon={
        <span
          className="pi pi-copy"
          style={{
            color: theme.palette.text.secondary,
            paddingRight: "0.5rem",
            fontSize: "1rem",
          }}
        />
      }
      label={label}
      onClick={onClick}
      style={{
        margin: "0 0.5rem",
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary,
        ...props.style,
      }}
    />
  );
}

export default Copy;
