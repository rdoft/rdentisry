import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Print({ label, onClick, ...props }) {
  return (
    <Tooltip title="Dışa aktar" placement="bottom" enterDelay={750}>
      <Button
        text
        outlined
        size="small"
        icon="pi pi-file-pdf"
        label={label}
        onClick={onClick}
        style={{ color: "#2644E1", ...props.style }}
      />
    </Tooltip>
  );
}

export default Print;
