import { useBreadcrumbs } from "store/hooks";
import { Grid } from "@mui/material";

import Checkout from "components/Subscription/Checkout";

function CheckoutPage() {
  // Set breadcrumbs for the checkout page with a navigation trail
  useBreadcrumbs([
    { title: 'Üyelik', url: '/pricing', id: 'pricing' },
    { title: 'Ödeme', url: '/checkout', id: 'checkout' }
  ]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Checkout />
      </Grid>
    </Grid>
  );
}

export default CheckoutPage;
