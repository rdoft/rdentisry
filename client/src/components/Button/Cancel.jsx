import React from "react";
import { Button } from "primereact";

function Cancel({ label, rounded, onClick, ...props }) {
  return (
    <Button
      text
      outlined
      label={label}
      rounded={rounded}
      size="small"
      icon="pi pi-times"
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={props.style}
    />
  );
}

export default Cancel;
