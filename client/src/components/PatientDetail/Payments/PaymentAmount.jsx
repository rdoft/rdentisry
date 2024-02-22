import React from "react";
import { Grid, Typography } from "@mui/material";
import { CardTitle } from "components/cards";
import PaymentType from "./PaymentType";

function PaymentAmount({ amount, type }) {
  const _amount = amount.toLocaleString("tr-TR", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  return (
    <Grid
      container
      alignItems="start"
      justifyContent="start"
      direction="column"
      spacing={1}
      pb={6}
    >
      <Grid item xs={12}>
        <CardTitle style={{ fontSize: "1.2rem" }}>
          <Typography variant="caption">₺</Typography> {_amount}
        </CardTitle>
      </Grid>
      <Grid item xs={12} fontSize={12}>
        <PaymentType type={type} />
      </Grid>
    </Grid>
  );
}

export default PaymentAmount;
