// material-ui
import { Grid } from "@mui/material";

// project import
import AppointmentCalendar from "components/AppointmentCalendar/AppointmentCalendar";

function AppointmentCalendarPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <AppointmentCalendar />
      </Grid>
    </Grid>
  );
};

export default AppointmentCalendarPage;
