import React from "react";
import { Button } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function Refer({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Button
      outlined
      size="small"
      icon={
        <span
          className="pi pi-gift"
          style={{
            color: theme.palette.text.secondary,
            paddingRight: "0.3rem",
          }}
        />
      }
      label={label}
      onClick={onClick}
      style={{
        margin: "0 0.5rem",
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary,
        fontWeight: "light",
        ...props.style,
      }}
    />
  );
}

export default Refer;
