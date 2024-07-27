import React from "react";
import { Button } from "primereact";

function SwitchTeeth({ label, onClick, ...props }) {
  return (
    <Button
      outlined
      size="small"
      label={label}
      onClick={onClick}
      style={{ color: "#2644E1", padding: "0.3rem", ...props.style }}
    />
  );
}

export default SwitchTeeth;
