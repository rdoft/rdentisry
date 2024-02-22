import React from "react";
import { Button } from "primereact";

function Next({ label, onClick, ...props }) {
  return (
    <Button
      text
      rounded
      icon="pi pi-angle-right"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={props.style}
    />
  );
}

export default Next;
