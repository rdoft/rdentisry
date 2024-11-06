import React from "react";
import { Divider } from "primereact";
import { Grid, Box, Typography } from "@mui/material";
import { Subscribe, Cancel } from "components/Button";
import { useTheme } from "@mui/material/styles";

function PricingCard({ pricing, subscription, selected, onSelect, onCancel }) {
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
  // onSelect handler for the pricing card subscription
  const handleSelect = () => {
    onSelect(pricing);
  };

  // onCancel handler for subscription
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Grid container item justifyContent="center">
      {/* Emphesis */}
      {emphesis && !subscription && !selected && (
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
      )}

      <Grid
        container
        item
        sx={{
          padding: 2,
          borderRadius: "0.5rem",
          backgroundColor: theme.palette.common.white,
          border:
            (emphesis && !subscription) || selected
              ? `1px solid ${theme.palette.text.secondary}`
              : `1px solid ${theme.palette.grey[300]}`,
          boxShadow:
            emphesis && !subscription
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

        {/* Subscribe button or Current information */}
        {!selected && (
          <Grid item xs={12} py={1}>
            {subscription ? (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  height: "3rem",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.background.primary,
                }}
              >
                <Grid item xs>
                  <Typography
                    variant="h5"
                    fontWeight="light"
                    style={{
                      alignContent: "center",
                      textAlign: "center",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Mevcut Planın
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <Cancel
                    label="İptal Et"
                    onClick={handleCancel}
                    style={{
                      padding: "0.5rem",
                      marginRight: "0.5rem",
                      fontSize: "0.8rem",
                      color: theme.palette.text.error,
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Subscribe
                label="Seç"
                onClick={handleSelect}
                style={
                  emphesis && {
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.text.secondary,
                  }
                }
              />
            )}
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
            {subscription && (
              <small style={{ color: theme.palette.grey[500] }}>
                {" ( Kalan: "}
                {subscription.doctors} Hekim. )
              </small>
            )}
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
            {subscription && (
              <small style={{ color: theme.palette.grey[500] }}>
                {" ( Kalan: "}
                {subscription.patients} Hasta. )
              </small>
            )}
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
            {subscription && (
              <small style={{ color: theme.palette.grey[500] }}>
                {" ( Kalan: "}
                {subscription.sms} SMS. )
              </small>
            )}
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
            {subscription && (
              <small style={{ color: theme.palette.grey[500] }}>
                {" ( Kalan: "}
                {subscription.storage} MB. )
              </small>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PricingCard;
