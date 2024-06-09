import React from "react";
import { Grid } from "@mui/material";
import { StatisticCard } from "components/cards";

export function PaymentStatistic({
  totalAmount,
  completedAmount,
  waitingAmount,
  overdueAmount,
}) {
  return (
    <Grid container item xs={12} p={2} spacing={3} justifyContent="center">
      <Grid item xs={3} md={2}>
        <StatisticCard
          label={"Tedavi Tutarı"}
          amount={totalAmount}
          backgroundColor="#F5F5F5"
          color="#182A4C"
        ></StatisticCard>
      </Grid>
      <Grid item xs={3} md={2}>
        <StatisticCard
          label={"Ödenen"}
          amount={completedAmount}
          backgroundColor="#DFFCF0"
          color="#22A069"
        ></StatisticCard>
      </Grid>
      <Grid item xs={3} md={2}>
        <StatisticCard
          label={"Kalan"}
          amount={waitingAmount}
          backgroundColor="#E8F0FF"
          color="#1E7AFC"
        ></StatisticCard>
      </Grid>
      {/* {overdueAmount !== 0 && (
      <Grid item xs={3} md={2}>
        <StatisticCard
          label={"Vadesi Geçen"}
          amount={overdueAmount}
          backgroundColor="#FFD2CB"
          color="#EF4444"
        ></StatisticCard>
      </Grid>
      )} */}
    </Grid>
  );
}

export default PaymentStatistic;
