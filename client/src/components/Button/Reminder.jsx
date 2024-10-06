import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function Reminder({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Tooltip
      title={"Hesap adınız kayıtlı ve hasta SMS izni açık olmalıdır"}
      placement="bottom"
      enterDelay={500}
      arrow
    >
      <Button
        outlined
        size="small"
        icon="pi pi-bell"
        label={label}
        onClick={onClick}
        style={{
          margin: "0 0.5rem",
          color: theme.palette.text.secondary,
          fontWeight: "light",
          fontSize: "0.8rem",
          ...props.style,
        }}
      />
    </Tooltip>
  );
}

export default Reminder;
