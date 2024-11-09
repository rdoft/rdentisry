import React from "react";
import { ProgressBar } from "primereact";
import { Grid } from "@mui/material";
import { StatisticCard } from "components/cards";
import { Reminder } from "components/Button";
import { SubscriptionController } from "components/Subscription";

// assets
import { useTheme } from "@mui/material/styles";

function PaymentStatistic({
  total,
  completedTotal,
  completed,
  waiting,
  remaining,
  overdue,
  dept,
  onSendReminder,
}) {
  const theme = useTheme();

  // Calculate progress
  const totalProgress =
    total > 0 ? Math.floor((completed / total) * 100) : completed > 0 ? 100 : 0;

  const completedProgress =
    completedTotal > 0
      ? Math.floor((completed / completedTotal) * 100)
      : completed > 0
      ? 100
      : 0;

  const allowReminder = overdue > 0 || (remaining <= 0 && dept > 0);

  return (
    <Grid container item xs={8} p={2} alignItems="center">
      <Grid container item xs={8} justifyContent="center">
        <Grid item xs={7}>
          <ProgressBar
            value={totalProgress}
            showValue={false}
            style={{ height: "8px", backgroundColor: theme.palette.text.info }}
            color={theme.palette.text.success}
          />
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"TÜM TEDAVİ"}
            amount={total}
            backgroundColor={theme.palette.background.primary}
            color={theme.palette.text.primary}
            sm
          ></StatisticCard>
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"BEKLEYEN"}
            amount={waiting}
            backgroundColor={theme.palette.background.info}
            color={theme.palette.text.info}
            sm
          ></StatisticCard>
        </Grid>

        <Grid item xs={7} pt={2}>
          <ProgressBar
            value={completedProgress}
            showValue={false}
            style={{ height: "8px", backgroundColor: theme.palette.text.error }}
            color={theme.palette.text.success}
          />
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"TAMAMLANAN TEDAVİ"}
            amount={completedTotal}
            backgroundColor={theme.palette.background.primary}
            color={theme.palette.text.primary}
            sm
          ></StatisticCard>
        </Grid>
        <Grid item xs={6}>
          <StatisticCard
            label={"BORÇ"}
            amount={dept}
            backgroundColor={theme.palette.background.error}
            color={theme.palette.text.error}
            sm
          ></StatisticCard>
        </Grid>
      </Grid>

      <Grid container item xs={4}>
        <Grid item xs={12}>
          <StatisticCard
            label={"ÖDENEN"}
            amount={completed}
            color={theme.palette.text.primary}
          ></StatisticCard>
        </Grid>

        {allowReminder && (
          <Grid item xs={12} textAlign="center" pt={1}>
            <SubscriptionController type="sms">
              <Reminder label="Hatırlatma Gönder" onClick={onSendReminder} />
            </SubscriptionController>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default PaymentStatistic;
