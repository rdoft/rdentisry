import { React } from "react";
import { Grid, Stack, Typography } from "@mui/material";

function StatisticCard({ label, amount, ...props }) {
  return (
    <Stack
      p={1}
      spacing={0.5}
      alignItems="center"
      style={{
        color: props.color,
        backgroundColor: props.backgroundColor,
        borderRadius: 7,
      }}
    >
      <Typography variant="h6">{label}</Typography>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Typography variant="h5" component="span">
            ₺
          </Typography>
          <Typography variant="h1" component="span" fontWeight="bold">
            {amount.toLocaleString("tr-TR", {
              style: "decimal",
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default StatisticCard;
