import React from "react";
import { Typography } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function PressKeyText({ text, keypad }) {
  const theme = useTheme();

  const splitted = text.split(keypad);

  return !keypad ? (
    <Typography variant="body2" p={1}>
      {text}
    </Typography>
  ) : (
    <Typography variant="body2" p={1}>
      {splitted[0]}
      <span
        style={{
          padding: "0.3rem",
          borderRadius: "8px",
          fontWeight: "bolder",
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.primary,
        }}
      >
        {keypad}
      </span>{" "}
      {splitted[1]}
    </Typography>
  );
}

export default PressKeyText;
