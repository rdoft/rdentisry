import React from "react";
import { Button } from "primereact";

function Cancel({ label, onClick, ...props }) {
  return (
    <Button
      text
      rounded
      icon="pi pi-times"
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={props.style}
    />
  );
}

export default Cancel;
