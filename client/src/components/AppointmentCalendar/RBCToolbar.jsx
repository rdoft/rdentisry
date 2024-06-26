import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Next, Prev, Basic, SelectButton } from "components/Button";

const CalendarToolbar = ({ date, label, view, views, onNavigate, onView }) => {
  const options = views.map((item) => {
    switch (item) {
      case "month":
        return {
          value: item,
          label: "Ay",
        };
      case "week":
        return {
          value: item,
          label: "Hafta",
        };
      case "day":
        return {
          value: item,
          label: "Gün",
        };
      default:
        return {
          value: item,
          label: item,
        };
    }
  });

  // HANDLERS -----------------------------------------------------------------
  // Navigate to previous date
  const handleNavigate = (action) => {
    onNavigate(action);
  };

  // Change the view
  const handleView = (event) => {
    onView(event.value);
  };

  return (
    <Grid container item alignItems="center" pb={1}>
      <Grid item xs={3}>
        <Box display="flex" gap={0.5}>
          <Prev onClick={() => handleNavigate("PREV")} />
          <Basic label={"Bugün"} onClick={() => handleNavigate("TODAY")} />
          <Next onClick={() => handleNavigate("NEXT")} />
        </Box>
      </Grid>

      <Grid item xs={6} textAlign="center">
        <Typography variant="h3" fontWeight="bolder" sx={{ color: "#182A4C" }}>
          {label}
        </Typography>
      </Grid>

      <Grid item xs={3} textAlign="end">
        <SelectButton value={view} onChange={handleView} options={options} />
      </Grid>
    </Grid>
  );
};

export default CalendarToolbar;
