import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Goto({ label, onClick, tooltip, ...props }) {
  return (
    <Tooltip title={tooltip} placement="bottom" enterDelay={750}>
      <Button
        text
        size="small"
        icon="pi pi-arrow-circle-right"
        severity={props.severity || "secondary"}
        label={label}
        onClick={onClick}
        style={props.style}
      />
    </Tooltip>
  );
}

export default Goto;
