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
        icon={
          <span
            className={props.icon ? props.icon : "pi pi-bell"}
            style={{ color: "#F5AF00", paddingRight: "0.5rem" }}
          />
        }
        label={label}
        onClick={onClick}
        style={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.grey[300],
          fontWeight: "light",
          fontSize: "0.8rem",
          ...props.style,
        }}
      />
    </Tooltip>
  );
}

export default Reminder;
