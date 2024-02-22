import React from "react";
import { Button } from "primereact";

function Add({ label, onClick, ...props }) {
  return (
    <Button
      text
      outlined
      size="small"
      icon="pi pi-plus"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={props.style}
    />
  );
}

export default Add;
