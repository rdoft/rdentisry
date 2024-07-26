import { Grid } from "@mui/material";
import Privacy from "components/Legal/Privacy";

function PrivacyPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Privacy />
      </Grid>
    </Grid>
  );
}

export default PrivacyPage;
