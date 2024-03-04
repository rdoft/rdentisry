import { Grid } from "@mui/material";

// project import
import ResetPassword from "components/Auth/ResetPassword";

function ResetPasswordPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <ResetPassword />
      </Grid>
    </Grid>
  );
}

export default ResetPasswordPage;
