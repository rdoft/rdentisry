// material-ui
import { Grid } from "@mui/material";

// project import
// import OrdersTable from "./OrdersTable";
import PatientDetail from "components/PatientDetail/PatientDetail";

function Patient() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <PatientDetail />
      </Grid>
    </Grid>
  );
};

export default Patient;
