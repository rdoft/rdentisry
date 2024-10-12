import { Grid } from "@mui/material";
import AppointmentConfirmation from "components/Confirmation/AppointmentConfirmation";

function AppointmentConfirmationPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <AppointmentConfirmation />
      </Grid>
    </Grid>
  );
}

export default AppointmentConfirmationPage;
