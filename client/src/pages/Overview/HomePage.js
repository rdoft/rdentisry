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
import PatientsIcon from "assets/images/icons/patients.png";
import CalenderIcon from "assets/images/icons/calender.png";
import ToDoIcon from "assets/images/icons/todo.png";
import DentistIcon from "assets/images/icons/dentist.png";
import BarChartIcon from "assets/images/icons/barchart.png";
import PaymentIcon from "assets/images/icons/wallet.png";

const HomePage = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Anasayfa</Typography>
      </Grid>

      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Feature image={PatientsIcon} title="Hastalar" />
      </Grid>

      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Feature image={DentistIcon} title="Doktorlar" />
      </Grid>
      
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Feature image={CalenderIcon} title="Takvim" />
      </Grid>

      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Feature image={ToDoIcon} title="İşlemler" />
      </Grid>

      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Feature image={PaymentIcon} title="Ödemeler" />
      </Grid>

      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Feature image={BarChartIcon} title="Finansal" />
      </Grid>
    </Grid>
  );
};

export default HomePage;
