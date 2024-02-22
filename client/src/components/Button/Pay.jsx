import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Pay({ label, onClick, ...props }) {
  return (
    <Tooltip title="Öde" placement="bottom" enterDelay={500}>
      <Button
        text
        outlined
        size="small"
        icon="pi pi-check-circle"
        label={label}
        severity={props.severity || "success"}
        onClick={onClick}
        style={props.style}
      />
    </Tooltip>
  );
}

export default Pay;
