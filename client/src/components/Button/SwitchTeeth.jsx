import React from "react";
import { Button } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function SwitchTeeth({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Button
      outlined
      size="small"
      label={label}
      onClick={onClick}
      style={{
        color: theme.palette.text.secondary,
        padding: "0.3rem",
        ...props.style,
      }}
    />
  );
}

export default SwitchTeeth;
