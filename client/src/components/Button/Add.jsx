import React from "react";
import { Button } from "primereact";

function Add({ label, onClick, ...props }) {
  return props.default ? (
    <Button
      size="small"
      icon="pi pi-plus"
      label={label}
      onClick={onClick}
      style={{ marginRight: "0.5rem", ...props.style }}
    />
  ) : (
    <Button
      text
      outlined
      size="small"
      icon="pi pi-plus"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={{ marginRight: "0.5rem", ...props.style }}
    />
  );
}

export default Add;
