import { useBreadcrumbs } from "store/hooks";
import { Grid } from "@mui/material";

// project import
import PatientTable from "components/PatientTable/PatientTable";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Patients = () => {
  // Set breadcrumbs for this page
  useBreadcrumbs([
    { title: 'Hastalar', url: '/patients', id: 'patients' }
  ]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <PatientTable />
      </Grid>
    </Grid>
  );
};

export default Patients;
