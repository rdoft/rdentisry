import React from "react";
import { Button } from "primereact";

function More({ label, onClick, ...props }) {
  return (
    <Button
      className="bg-bluegray-50 hover:bg-bluegray-100 border-0 text-bluegray-900 mr-2"
      size="small"
      icon="pi pi-ellipsis-h"
      label={label}
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={props.style}
    />
  );
}

export default More;
