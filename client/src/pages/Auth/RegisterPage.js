// material-ui
import { Grid } from "@mui/material";

// project import
import Register from "components/Auth/Register";

function RegisterPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Register />
      </Grid>
    </Grid>
  );
}

export default RegisterPage;
