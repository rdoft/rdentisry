import React from "react";
import BaseButton from "./BaseButton";

function Prev({ onClick, ...props }) {
  return (
    <BaseButton
      icon="pi pi-angle-left"
      onClick={onClick}
      variant="text"
      severity="secondary"
      size="small"
      {...props}
    />
  );
}

export default Prev;
