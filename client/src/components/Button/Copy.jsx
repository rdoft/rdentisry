import React from "react";
import BaseButton from "./BaseButton";

function Copy({ label, onClick, ...props }) {
  return (
    <BaseButton
      icon="pi pi-copy"
      label={label}
      onClick={onClick}
      variant="outlined"
      size="medium"
      {...props}
    />
  );
}

export default Copy;
