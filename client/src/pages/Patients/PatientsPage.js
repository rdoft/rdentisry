// material-ui
import { Grid, Typography } from "@mui/material";

// project import
// import OrdersTable from "./OrdersTable";
import PatientList from "components/PatientList/PatientList";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Patients = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Hastalar</Typography>
      </Grid>
      <Grid item xs={12}>
        <PatientList />
      </Grid>
    </Grid>
  );
};

export default Patients;
