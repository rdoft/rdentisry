import React from "react";
import { ProgressBar } from "primereact";
import { Grid } from "@mui/material";
import { StatisticCard } from "components/cards";

function PaymentStatistic({
  total,
  completedTotal,
  completed,
  waiting,
  overdue,
  dept,
}) {
  // Calculate progress
  const totalProgress =
    total > 0 ? Math.floor((completed / total) * 100) : completed > 0 ? 100 : 0;

  const completedProgress =
    completedTotal > 0
      ? Math.floor((completed / completedTotal) * 100)
      : completed > 0
      ? 100
      : 0;

  return (
    <Grid container item xs={8} p={2} alignItems="center">
      <Grid container item xs={8} justifyContent="center">
        <Grid item xs={7}>
          <ProgressBar
            value={totalProgress}
            showValue={false}
            style={{ height: "8px", backgroundColor: "#1E7AFC" }}
            color="#22A06A"
          />
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"TÜM TEDAVİ"}
            amount={total}
            backgroundColor="#F5F5F5"
            color="#182A4C"
            sm
          ></StatisticCard>
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"BEKLEYEN"}
            amount={waiting}
            backgroundColor="#E8F0FF"
            color="#1E7AFC"
            sm
          ></StatisticCard>
        </Grid>

        <Grid item xs={7} pt={2}>
          <ProgressBar
            value={completedProgress}
            showValue={false}
            style={{ height: "8px", backgroundColor: "#EF4444" }}
            color="#22A06A"
          />
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"TAMAMLANAN TEDAVİ"}
            amount={completedTotal}
            backgroundColor="#F5F5F5"
            color="#182A4C"
            sm
          ></StatisticCard>
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"BORÇ"}
            amount={dept}
            backgroundColor="#FFD2CB"
            color="#EF4444"
            sm
          ></StatisticCard>
        </Grid>
        
      </Grid>

      <Grid item xs={4}>
        <StatisticCard
          label={"ÖDENEN"}
          amount={completed}
          color="#182A4C"
        ></StatisticCard>
      </Grid>
    </Grid>
  );
}

export default PaymentStatistic;
