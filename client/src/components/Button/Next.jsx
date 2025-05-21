import React from "react";
import BaseButton from "./BaseButton";

function Next({ onClick, ...props }) {
  return (
    <BaseButton
      icon="pi pi-angle-right"
      onClick={onClick}
      variant="text"
      severity="secondary"
      size="small"
      {...props}
    />
  );
}

export default Next;
