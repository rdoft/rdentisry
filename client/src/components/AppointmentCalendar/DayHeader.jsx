import React from "react";
import { Typography, Box } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function DayHeader({ date, label }) {
  const theme = useTheme();
  const today = new Date();
  const isToday = date && today.toDateString() === date.toDateString();

  const splitted = label.split(" ");
  let dayNumber;
  let dayName;

  if (splitted.length === 2) {
    dayNumber = splitted[0];
    dayName = splitted[1];
  } else {
    dayName = splitted[0];
  }

  return dayNumber ? (
    <>
      <Typography
        variant="h6"
        component={Box}
        pt={1}
        sx={{
          color: isToday
            ? theme.palette.common.white
            : theme.palette.text.primary,
          bgcolor: isToday ? theme.palette.text.error : "transparent",
          borderRadius: "10px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          margin: "0.2rem auto 0",
          fontWeight: isToday ? "bold" : "normal",
        }}
      >
        {dayNumber}
      </Typography>
      <Typography
        variant="h6"
        pb={1}
        sx={{
          color: theme.palette.text.primary,
          fontWeight: isToday ? "bold" : "normal",
        }}
      >
        {dayName}
      </Typography>
    </>
  ) : (
    <Typography variant="h6" p={2} sx={{ color: theme.palette.text.primary }}>
      {dayName}
    </Typography>
  );
}

export default DayHeader;
