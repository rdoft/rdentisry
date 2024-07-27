import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Print({ label, onClick, ...props }) {
  return (
    <Tooltip title="PDF" placement="bottom" enterDelay={750}>
      <Button
        outlined
        size="small"
        icon="pi pi-print"
        label={label}
        onClick={onClick}
        style={{ color: "#2644E1", padding: "0.3rem", ...props.style }}
      />
    </Tooltip>
  );
}

export default Print;
