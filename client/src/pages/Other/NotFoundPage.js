import { Grid } from "@mui/material";
import { NotFound } from "components/Other";

function NotFoundPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <NotFound />
      </Grid>
    </Grid>
  );
}

export default NotFoundPage;
