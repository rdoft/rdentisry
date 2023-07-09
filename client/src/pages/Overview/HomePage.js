import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

// project import
import Feature from "components/cards/Feature";

// assets
import { PatientsIcon, CalenderIcon } from "assets/images/icons";

const HomePage = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={6} sm={6} md={3} lg={2}>
        <Link to="/calendar" style={{ textDecoration: "none" }}>
          <Feature image={CalenderIcon} title="Takvim" />
        </Link>
      </Grid>

      <Grid item xs={6} sm={6} md={3} lg={2}>
        <Link to="/patients" style={{ textDecoration: "none" }}>
          <Feature image={PatientsIcon} title="Hastalar" />
        </Link>
      </Grid>
      {/* 
      <Grid item xs={6} sm={6} md={3} lg={2}>
        <Feature image={DentistIcon} title="Doktorlar" />
        </Grid>

      
      <Grid item xs={6} sm={6} md={3} lg={2}>
        <Feature image={ToDoIcon} title="İşlemler" />
      </Grid>

      <Grid item xs={6} sm={6} md={3} lg={2}>
        <Feature image={PaymentIcon} title="Ödemeler" />
      </Grid>

      <Grid item xs={6} sm={6} md={3} lg={2}>
        <Feature image={BarChartIcon} title="Finansal" />
      </Grid> */}
    </Grid>
  );
};

export default HomePage;
