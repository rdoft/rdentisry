import { Grid } from "@mui/material";

import CheckoutResult from "components/Subscription/CheckoutResult";

function CheckoutResultPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <CheckoutResult />
      </Grid>
    </Grid>
  );
}

export default CheckoutResultPage;
