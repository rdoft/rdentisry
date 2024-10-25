import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function Reminder({ label, disabled, onClick, ...props }) {
  const theme = useTheme();

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
    >
      <span>
        <Button
          outlined
          size="small"
          icon={
            <span
              className={props.icon ? props.icon : "pi pi-bell"}
              style={{ color: "#F5AF00", paddingRight: "0.5rem" }}
            />
          }
          label={label}
          onClick={handleClick}
          style={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.grey[300],
            fontWeight: "light",
            fontSize: "0.8rem",
            opacity: disabled ? 0.5 : 1,
            ...props.style,
          }}
        />
      </span>
    </Tooltip>
  );
}

export default Reminder;
