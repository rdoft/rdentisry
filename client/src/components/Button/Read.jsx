import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function Read({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Tooltip title="Okundu" placement="bottom" enterDelay={500}>
      <Button
        text
        outlined
        size="small"
        icon="pi pi-check-circle"
        label={label}
        severity={props.severity || "secondary"}
        onClick={onClick}
        style={{
          color: theme.palette.text.secondary,
          ...props.style,
        }}
      />
    </Tooltip>
  );
}

export default Read;
