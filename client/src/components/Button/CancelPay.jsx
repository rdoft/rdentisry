import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function CancelPay({ label, onClick, ...props }) {
  return (
    <Tooltip title="Ödemeyi iptal et" placement="bottom" enterDelay={500}>
      <Button
        text
        outlined
        size="small"
        icon="pi pi-times-circle"
        label={label}
        severity={props.severity || "info"}
        onClick={onClick}
        style={props.style}
      />
    </Tooltip>
  );
}

export default CancelPay;
