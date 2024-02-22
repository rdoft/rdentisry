import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Edit({ label, onClick, ...props }) {
  return (
    <Tooltip title="Görüntüle / Düzenle" placement="bottom" enterDelay={750}>
      <Button
        text
        outlined
        size="small"
        icon="pi pi-external-link"
        severity={props.severity || "secondary"}
        label={label}
        onClick={onClick}
        style={props.style}
      />
    </Tooltip>
  );
}

export default Edit;
