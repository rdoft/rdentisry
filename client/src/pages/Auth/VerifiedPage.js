import { Grid } from "@mui/material";
import Verified from "components/Auth/Verified";

function VerifiedPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Verified />
      </Grid>
    </Grid>
  );
}

export default VerifiedPage;
