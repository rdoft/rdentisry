// material-ui
import { Grid } from "@mui/material";

// project import
// import OrdersTable from "./OrdersTable";
import PatientTable from "components/PatientTable/PatientTable";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Patients = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <PatientTable />
      </Grid>
    </Grid>
  );
};

export default Patients;
