import { useBreadcrumbs } from "store/hooks";
import { Grid } from "@mui/material";

import ProcedureTable from "components/ProcedureTable/ProcedureTable";

const Procedures = () => {
  // Set breadcrumbs for the procedures page
  useBreadcrumbs([
    { title: 'Tedaviler', url: '/procedures', id: 'procedures' }
  ]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <ProcedureTable />
      </Grid>
    </Grid>
  );
};

export default Procedures;
