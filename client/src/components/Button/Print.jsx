import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function Print({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Tooltip title="PDF" placement="bottom" enterDelay={750}>
      <Button
        outlined
        size="small"
        icon="pi pi-print"
        label={label}
        onClick={onClick}
        style={{
          color: theme.palette.text.secondary,
          padding: "0.3rem",
          ...props.style,
        }}
      />
    </Tooltip>
  );
}

export default Print;
