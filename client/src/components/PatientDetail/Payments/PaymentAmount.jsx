import React from "react";
import { Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import { CardTitle } from "components/Cards";
import { Reduce } from "components/Button";

function PaymentAmount({ amount, paid, isReduce, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // HANDLERS -----------------------------------------------------------------
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
      alignItems="center"
      spacing={1}
      sx={{ width: "100%", paddingBottom: 1 }}
    >
      {paid != null ? (
        <Grid item xs={12}>
          <CardTitle
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="caption" sx={{ mr: 0.5 }}>
              ₺
            </Typography>
            {_amount}
            <Typography variant="caption">/ {_paid}</Typography>
          </CardTitle>
        </Grid>
      ) : (
        <>
          <Grid item xs={isMobile ? 12 : "auto"}>
            <CardTitle
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: isMobile ? 1 : 0,
              }}
            >
              <Typography variant="caption" sx={{ mr: 0.5 }}>
                ₺
              </Typography>
              {_amount}
            </CardTitle>
          </Grid>
          <Grid
            item
            xs="auto"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "flex-start" : "center",
            }}
          >
            <Reduce isReduce={isReduce} onClick={handleClickReduce} />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default PaymentAmount;
