import { React } from "react";
import { Grid, Stack, Typography } from "@mui/material";

function StatisticCard({ label, amount }) {
  let backgroundColor;
  let color;
  switch (label) {
    case "Ödenen":
      backgroundColor = "#DFFCF0";
      color = "#22A069";
      break;
    case "Kalan":
      backgroundColor = "#E8F0FF";
      color = "#1E7AFC";
      break;
    case "Vadesi Geçen":
      backgroundColor = "#FFD2CB";
      color = "#EF4444";
      break;
    default:
      break;
  }

  return (
    <Stack
      p={1}
      spacing={0.5}
      alignItems="center"
      style={{
        color: color,
        backgroundColor: backgroundColor,
        borderRadius: 7,
      }}
    >
      <Typography variant="h6">{label}</Typography>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item pr={1}>
          <Typography variant="h6">₺</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h1" fontWeight="light">
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
