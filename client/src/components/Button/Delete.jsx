import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Delete({ label, onClick, ...props }) {
  return (
    <Tooltip title="Sil" placement="bottom" enterDelay={750}>
      <Button
        text
        outlined
        size="small"
        icon="pi pi-trash"
        label={label}
        severity={props.severity || "danger"}
        onClick={onClick}
        style={props.style}
      />
    </Tooltip>
  );
}

export default Delete;
