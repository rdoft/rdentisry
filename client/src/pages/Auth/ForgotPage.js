// material-ui
import { Grid } from "@mui/material";

// project import
import Forgot from "components/Auth/Forgot";

function ForgotPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Forgot />
      </Grid>
    </Grid>
  );
}

export default ForgotPage;
