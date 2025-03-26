import { React } from "react";
import { Grid, Stack, Typography } from "@mui/material";

function StatisticCard({ label, amount, ...props }) {
  const intAmount = amount
    .toLocaleString("tr-TR", {
      style: "decimal",
      maximumFractionDigits: 2,
    })
    .split(",")[0];
  const decAmount = amount
    .toLocaleString("tr-TR", {
      style: "decimal",
      maximumFractionDigits: 2,
    })
    .split(",")[1];

  return (
    <Stack
      p={0.5}
      m={1}
      alignItems="center"
      style={{
        color: props.color,
        backgroundColor: props.backgroundColor,
        borderRadius: 7,
      }}
    >
      <Typography
        variant={props.sm ? "h6" : "poster"}
        fontWeight="bolder"
        noWrap
        style={{ opacity: "0.6" }}
      >
        {label}
      </Typography>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Typography
            variant={props.sm ? "h5" : "h4"}
            component="span"
            pr={1}
            style={{ opacity: "0.8" }}
          >
            ₺
          </Typography>
          <Typography
            variant={props.sm ? "h3" : "h1"}
            component="span"
            fontWeight="bold"
          >
            {intAmount}
            {decAmount && (
              <span style={{ fontSize: "0.5em" }}>,{decAmount}</span>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default StatisticCard;
