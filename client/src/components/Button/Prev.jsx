import React from "react";
import { Button } from "primereact";

function Prev({ label, onClick, ...props }) {
  return (
    <Button
      text
      rounded
      icon="pi pi-angle-left"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={props.style}
    />
  );
}

export default Prev;
