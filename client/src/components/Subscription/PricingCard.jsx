import React from "react";
import { Divider } from "primereact";
import { Grid, Box, Typography } from "@mui/material";
import { Subscribe } from "components/Button";
import { useTheme } from "@mui/material/styles";

function PricingCard({ pricing, current, selected, onClick }) {
  const theme = useTheme();

  const [integerPart, decimalPart] = pricing.price
    .toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
    })
    .split(".");

  let name;
  let emphesis = false;
  switch (pricing.name) {
    case "dentist-basic":
      name = "HEKİM. S";
      break;
    case "dentist-medium":
      name = "HEKİM. M";
      emphesis = true;
      break;
    case "dentist-pro":
      name = "HEKİM. L";
      break;
    case "clinic-basic":
      name = "KLİNİK. S";
      break;
    case "clinic-medium":
      name = "KLİNİK. M";
      emphesis = true;
      break;
    case "clinic-pro":
      name = "KLİNİK. L";
      break;
    case "polyclinic-basic":
      name = "POLİKLİNİK. S";
      break;
    case "polyclinic-medium":
      name = "POLİKLİNİK. M";
      emphesis = true;
      break;
    case "polyclinic-pro":
      name = "POLİKLİNİK. L";
      break;
    default:
      name = pricing.name;
      break;
  }

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onClick handler for the pricing card
  const handleClick = () => {
    onClick(pricing);
  };

  return (
    <Grid container item justifyContent="center">
      {/* Popular */}
      {current ? (
        <Typography
          variant="h5"
          fontWeight="light"
          sx={{
            color: theme.palette.common.white,
            backgroundColor: theme.palette.text.secondary,
            padding: "0.3rem 0.5rem",
            borderRadius: "0.5rem",
            width: "100%",
            textAlign: "center",
          }}
        >
          Mevcut Planın
        </Typography>
      ) : (
        emphesis &&
        !selected && (
          <Typography
            variant="h5"
            fontWeight="light"
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.background.secondary,
              padding: "0.3rem 0.5rem",
              borderRadius: "0.5rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            Önerilen
          </Typography>
        )
      )}

      {/* Card */}
      <Grid
        container
        item
        sx={{
          padding: 2,
          borderRadius: "0.5rem",
          backgroundColor: theme.palette.common.white,
          border:
            emphesis || selected
              ? `1px solid ${theme.palette.text.secondary}`
              : `1px solid ${theme.palette.grey[300]}`,
          boxShadow: emphesis
            ? `0 10px 10px ${theme.palette.background.secondary}`
            : "none",
        }}
      >
        {/* Name */}
        <Grid item xs={12} my={1}>
          <Typography
            variant="h4"
            fontWeight="regular"
            sx={{ color: theme.palette.text.primary }}
          >
            {name}
          </Typography>
        </Grid>

        <Divider className="m-0 p-1" />

        {/* Price */}
        <Grid item xs={12} py={1}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h2"
              fontWeight="bolder"
              color={theme.palette.text.primary}
            >
              <span style={{ fontSize: "1.5rem", fontWeight: 300 }}>₺ </span>
              {integerPart}
              <span
                style={{ fontSize: "1rem", color: theme.palette.grey[500] }}
              >
                ,{decimalPart}
              </span>
            </Typography>
            <Typography variant="body1" ml={1}>
              / ay
            </Typography>
          </Box>
        </Grid>

        {/* Subscribe button */}
        {!selected && (
          <Grid item xs={12} py={1}>
            <Subscribe
              label="Seç"
              onClick={handleClick}
              style={
                emphesis && {
                  color: theme.palette.common.white,
                  backgroundColor: theme.palette.text.secondary,
                }
              }
            />
          </Grid>
        )}

        {/* Features */}
        <Grid item xs={12} py={1}>
          <Typography variant="body1">
            <i
              className="pi pi-check-circle"
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                paddingRight: "0.5rem",
                color: theme.palette.text.secondary,
              }}
            ></i>
            {pricing.maxDoctors} Hekim.
          </Typography>
          <Typography variant="body1">
            <i
              className="pi pi-check-circle"
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                paddingRight: "0.5rem",
                color: theme.palette.text.secondary,
              }}
            ></i>
            {pricing.maxPatients} Hasta.
          </Typography>
          <Typography variant="body1">
            <i
              className="pi pi-check-circle"
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                paddingRight: "0.5rem",
                color: theme.palette.text.secondary,
              }}
            ></i>
            {pricing.maxSMS} SMS.
          </Typography>
          <Typography variant="body1">
            <i
              className="pi pi-check-circle"
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                paddingRight: "0.5rem",
                color: theme.palette.text.secondary,
              }}
            ></i>
            {pricing.maxStorage / 1024}GB Depolama.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PricingCard;
