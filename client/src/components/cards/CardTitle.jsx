import React from "react";
import { Typography } from "@mui/material";

function CardTitle({ children, ...props }) {
  return (
    <Typography
      variant={props.variant || "h5"}
      sx={{
        padding: 1,
        borderRadius: "8px",
        fontWeight: "bolder",
        color: "#182A4D",
        backgroundColor: "#F5F5F5",
        ...props.style,
      }}
    >
      {children}
    </Typography>
  );
}

export default CardTitle;
