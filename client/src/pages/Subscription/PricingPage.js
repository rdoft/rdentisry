import { Grid } from "@mui/material";

import Pricing from "components/Subscription/Pricing";

function PricingPage() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Pricing />
      </Grid>
    </Grid>
  );
}

export default PricingPage;
