import { Grid } from "@mui/material";

import Checkout from "components/Subscription/Checkout";

function CheckoutPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Checkout />
      </Grid>
    </Grid>
  );
}

export default CheckoutPage;
