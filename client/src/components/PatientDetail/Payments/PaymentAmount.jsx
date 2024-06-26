import React from "react";
import { Grid, Typography } from "@mui/material";
import { CardTitle } from "components/cards";
import { Reduce } from "components/Button";

function PaymentAmount({ amount, paid, isReduce, onChange }) {
  // HANDLERS -----------------------------------------------------------------
  // onChnageReduce handler
  const handleClickReduce = () => {
    onChange(!isReduce);
  };

  // TEMPLATEs -----------------------------------------------------------------
  const _amount = amount.toLocaleString("tr-TR", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  const _paid = paid?.toLocaleString("tr-TR", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  return (
    <Grid
      container
      alignItems="start"
      justifyContent="start"
      direction="column"
      paddingBottom={1}
    >
      {paid != null ? (
        <Grid item xs={12}>
          <CardTitle variant="h4">
            <Typography variant="caption">₺</Typography>
            {_amount}
            <Typography variant="caption"> / {_paid}</Typography>
          </CardTitle>
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={"auto"} paddingRight={4}>
            <CardTitle variant="h4">
              <Typography variant="caption">₺</Typography>
              {_amount}
            </CardTitle>
          </Grid>
          <Grid item xs fontSize={12} alignContent="center">
            <Reduce isReduce={isReduce} onClick={handleClickReduce} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default PaymentAmount;
