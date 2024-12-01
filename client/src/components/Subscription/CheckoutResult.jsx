import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Subscribe } from "components/Button";
import ReactGA from "react-ga4";
import SubscriptionToolbar from "./SubscriptionToolbar";

// assets
import {
  PaymentFailImage,
  PaymentSuccessImage,
} from "assets/images/subscriptions";

function CheckoutResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const query = new URLSearchParams(location.search);

  const status = query.get("status");
  const message = query.get("message");
  const referenceCode = query.get("referenceCode");

  useEffect(() => {
    // Google Analytics
    ReactGA.event({
      category: "Subscription",
      action: status === "success" ? "PURCHASE_SUCCESS" : "PURCHASE_FAIL",
      label: referenceCode || "-",
    });
  }, [status, referenceCode]);

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onClick handler for try again
  const handleClickAgain = () => {
    navigate("/checkout");
  };

  return (
    <Grid container item rowSpacing={4.5} columnSpacing={2.75}>
      {/* Toolbar */}
      <Grid item xs={12}>
        <SubscriptionToolbar index={3} />
      </Grid>

      {/* Result */}
      <Grid
        container
        item
        xs={12}
        p={4}
        ml={3}
        sx={{
          borderRadius: "8px",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "start",
          height: "calc(100vh - 130px)",
        }}
      >
        {/* Image */}
        <Grid item xs={2}>
          <img
            src={status === "success" ? PaymentSuccessImage : PaymentFailImage}
            alt="result"
            style={{
              width: "100%",
            }}
          />
        </Grid>

        {/* Message */}
        <Grid item xs={12} textAlign="center">
          <Typography variant="h1" mb={1}>
            {status === "success" ? "Ödeme Başarılı." : "Ödeme Başarısız."}
          </Typography>
          <Typography variant="h4" fontWeight="light">
            {status === "success"
              ? "Yeni plan tanımlandı, hemen kullanmaya başlayabilirsin."
              : "Ödeme sırasında bir hata oldu. Lütfen tekrar deneyin."}
          </Typography>
          {/* Reference Code */}
          {referenceCode && (
            <Typography
              variant="h6"
              color={theme.palette.text.secondary}
              mt={3}
            >
              Ödeme Referans Kodu: {referenceCode}
            </Typography>
          )}
          {/* Message */}
          {message && (
            <Typography
              variant="h6"
              color={theme.palette.text.secondary}
              mt={3}
            >
              {message}
            </Typography>
          )}
        </Grid>

        {/* Button */}
        {status === "fail" && (
          <Grid item xs={3}>
            <Subscribe
              label="Ödeme Sayfasına Dön"
              onClick={handleClickAgain}
              style={{
                backgroundColor: theme.palette.text.secondary,
                color: theme.palette.common.white,
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default CheckoutResult;
