import React from "react";
import { Typography } from "@mui/material";

function PressKeyText({ text, keypad }) {
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
          color: "#182A4D",
          backgroundColor: "#F5F5F5",
        }}
      >
        {keypad}
      </span>{" "}
      {splitted[1]}
    </Typography>
  );
}

export default PressKeyText;
