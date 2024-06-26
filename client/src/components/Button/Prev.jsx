import React from "react";
import { Button } from "primereact";

function Prev({ label, onClick, ...props }) {
  return (
    <Button
      text
      size="small"
      icon="pi pi-angle-left"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={{
        color: "#182A4C",
        backgroundColor: "#F5F5F5",
        padding: "0.5rem",
        ...props.style,
      }}
    />
  );
}

export default Prev;
