import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";

// project import
import Feature from "components/cards/Feature";

// assets
import AppointmentIcon from "assets/images/icons/appointment.png";

const HomePage = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Anasayfa</Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Feature image={AppointmentIcon} title="Upcomming Appointment" />
      </Grid>
    </Grid>
  );
};

export default HomePage;
