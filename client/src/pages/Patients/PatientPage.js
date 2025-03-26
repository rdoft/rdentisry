// material-ui
import { useParams } from "react-router-dom";
import { useBreadcrumbs } from "store/hooks";
import { Grid } from "@mui/material";

// project import
import PatientDetail from "components/PatientDetail/PatientDetail";

function Patient() {
  const { id } = useParams();

  // Set breadcrumbs with a navigation trail
  useBreadcrumbs([
    { title: 'Hastalar', url: '/patients', id: 'patients' },
    { title: 'Hasta Detayı', url: `/patients/${id}`, id: 'patient-detail' }
  ]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <PatientDetail />
      </Grid>
    </Grid>
  );
};

export default Patient;
