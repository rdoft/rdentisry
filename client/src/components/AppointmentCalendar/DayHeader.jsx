import React from "react";
import { Typography } from "@mui/material";

function DayHeader({ date, label }) {
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
      <Typography variant="h4" pt={1}>
        {dayNumber}
      </Typography>
      <Typography variant="h5" fontWeight="light" pb={1}>
        {dayName}
      </Typography>
    </>
  ) : (
    <Typography variant="h5" fontWeight="light" p={2}>
      {dayName}
    </Typography>
  );
}

export default DayHeader;
