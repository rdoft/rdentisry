import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Next, Prev, Today, SelectButton } from "components/Button";

// assets
import { useTheme } from "@mui/material/styles";

const CalendarToolbar = ({ date, label, view, views, onNavigate, onView }) => {
  const theme = useTheme();

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
        <Box display="flex" gap={0.4}>
          <Today onClick={() => handleNavigate("TODAY")} />
          <Prev onClick={() => handleNavigate("PREV")} />
          <Next onClick={() => handleNavigate("NEXT")} />
        </Box>
      </Grid>

      <Grid item xs={6} textAlign="center">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: theme.palette.text.primary }}
        >
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
