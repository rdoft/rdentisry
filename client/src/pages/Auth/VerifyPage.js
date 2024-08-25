import { Grid } from "@mui/material";
import Verify from "components/Auth/Verify";

function VerifyPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Verify />
      </Grid>
    </Grid>
  );
}

export default VerifyPage;
