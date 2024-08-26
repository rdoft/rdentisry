import React from "react";
import { Button } from "primereact";
import { Avatar } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";
import logoutSvg from "assets/svg/profile/logout.svg";

function Logout({ label, onClick, ...props }) {
  const theme = useTheme();

  return (
    <Button
      text
      size="small"
      icon={
        <Avatar
          src={logoutSvg}
          sx={{ width: 16, height: 16, marginRight: 1 }}
        />
      }
      label="Çıkış Yap"
      severity={props.severity || "secondary"}
      onClick={onClick}
      style={{
        color: theme.palette.text.primary,
        padding: "0.5rem",
        ...props.style,
      }}
    />
  );
}

export default Logout;
