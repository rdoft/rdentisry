import { Grid } from "@mui/material";
import Terms from "components/Legal/Terms";

function TermsPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Terms />
      </Grid>
    </Grid>
  );
}

export default TermsPage;
