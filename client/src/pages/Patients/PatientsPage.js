// material-ui
import { Grid, Typography } from "@mui/material";

// project import
// import OrdersTable from "./OrdersTable";
import PatientsTable from "components/PatientTable/PatientsTable";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Patients = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <PatientsTable />
      </Grid>
    </Grid>
  );
};

export default Patients;
