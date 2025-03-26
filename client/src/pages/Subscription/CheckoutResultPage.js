import { useBreadcrumbs } from "store/hooks";
import { Grid } from "@mui/material";

import CheckoutResult from "components/Subscription/CheckoutResult";

function CheckoutResultPage() {
  // Set breadcrumbs for the checkout result page with complete navigation trail
  useBreadcrumbs([
    { title: 'Üyelik', url: '/pricing', id: 'pricing' },
    { title: 'Ödeme', url: '/checkout', id: 'checkout' },
    { title: 'Sonuç', url: '/checkout/result', id: 'checkout-result' }
  ]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <CheckoutResult />
      </Grid>
    </Grid>
  );
}

export default CheckoutResultPage;
