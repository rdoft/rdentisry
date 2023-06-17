// material-ui
import { Grid, Typography } from "@mui/material";

import AnalyticEcommerce from "components/cards/statistics/AnalyticEcommerce";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Overview = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Toplam Hasta Sayısı"
          count="2,245"
          percentage={23.4}
          extra="240"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Toplam Gelir"
          count="634,234"
          percentage={50.6}
          extra="320,000"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Toplam Gider"
          count="58,800"
          percentage={27.4}
          color="warning"
          extra="10,943"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="... "
          count="$35,078"
          percentage={27.4}
          isLoss
          color="error"
          extra="$20,395"
        />
      </Grid>
    </Grid>
  );
};

export default Overview;
