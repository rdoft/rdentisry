import React from "react";
import { Typography } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function CardTitle({ children, ...props }) {
  const theme = useTheme();

  return (
    <Typography
      variant={props.variant || "h5"}
      sx={{
        padding: 1,
        borderRadius: "8px",
        fontWeight: "bolder",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.primary,
        ...props.style,
      }}
    >
      {children}
    </Typography>
  );
}

export default CardTitle;
