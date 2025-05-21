import React from "react";
import BaseButton from "./BaseButton";
import { Tooltip } from "@mui/material";

function Reminder({
  label,
  disabled,
  onClick,
  icon = "pi pi-bell",
  variant = "outlined",
  severity = "warning",
  ...props
}) {
  const handleClick = (event) => {
    event.stopPropagation();
    if (!disabled) {
      onClick(event);
    }
  };

  return (
    <Tooltip
      title={disabled ? "Hasta SMS izni yoktur" : ""}
      placement="bottom"
      enterDelay={500}
      arrow
      style={{
        width: "100%",
        textAlign: "start",
      }}
    >
      <span>
        <BaseButton
          icon={icon}
          label={label}
          onClick={handleClick}
          disabled={disabled}
          variant={variant}
          severity={severity}
          style={{
            width: "100%",
            textAlign: "start",
            ...props.style,
          }}
          {...props}
        />
      </span>
    </Tooltip>
  );
}

export default Reminder;
