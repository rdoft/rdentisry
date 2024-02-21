import React from "react";
import { Grid, Typography } from "@mui/material";

function CardAmount({ amount }) {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item pr={0.5}>
        <Typography variant="h6">₺</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h3" fontWeight="light">
          {amount.toLocaleString("tr-TR", {
            style: "decimal",
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default CardAmount;
