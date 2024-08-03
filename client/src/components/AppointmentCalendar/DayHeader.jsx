import React from "react";
import { Typography } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function DayHeader({ date, label }) {
  const theme = useTheme();

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
        variant="h4"
        pt={1}
        sx={{ color: theme.palette.text.primary }}
      >
        {dayNumber}
      </Typography>
      <Typography
        variant="h5"
        fontWeight="light"
        pb={1}
        sx={{ color: theme.palette.text.primary }}
      >
        {dayName}
      </Typography>
    </>
  ) : (
    <Typography
      variant="h5"
      fontWeight="light"
      p={2}
      sx={{ color: theme.palette.text.primary }}
    >
      {dayName}
    </Typography>
  );
}

export default DayHeader;
