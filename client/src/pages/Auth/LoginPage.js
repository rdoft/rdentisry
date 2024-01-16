// material-ui
import { Grid } from "@mui/material";

// project import
import Login from "components/Auth/Login";

function LoginPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Login />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
