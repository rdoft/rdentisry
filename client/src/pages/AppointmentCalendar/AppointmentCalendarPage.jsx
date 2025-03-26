import { useBreadcrumbs } from "store/hooks";
import { Grid } from "@mui/material";

// project import
import AppointmentCalendar from "components/AppointmentCalendar/AppointmentCalendar";

function AppointmentCalendarPage() {
  // Set breadcrumbs for the calendar page
  useBreadcrumbs([
    { title: 'Takvim', url: '/', id: 'calendar' }
  ]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <AppointmentCalendar />
      </Grid>
    </Grid>
  );
};

export default AppointmentCalendarPage;
