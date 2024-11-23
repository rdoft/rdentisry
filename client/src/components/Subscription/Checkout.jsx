import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { Grid, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";
import { usePaymentContext } from "context/PaymentProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { Prev } from "components/Button";
import SubscriptionToolbar from "./SubscriptionToolbar";
import PricingCard from "./PricingCard";
import BillingForm from "./BillingForm";
import PaymentForm from "./PaymentForm";

// services
import { SubscriptionService } from "services";

const POLICY_URL = process.env.REACT_APP_POLICY_URL;
const TERMS_URL = process.env.REACT_APP_TERMS_URL;

function Checkout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { isSubscribed, isFree } = useSubscription();
  const { pricing, userDetail, clearPricing } = usePaymentContext();

  const [checkoutForm, setCheckoutForm] = useState(null);

  useEffect(() => {
    return () => {
      clearPricing();
    };
  }, [clearPricing]);

  // SERVICES -----------------------------------------------------------------
  // Init checkout proccess and redirect to the payment page
  const checkout = async () => {
    startLoading("save");
    try {
      const response = await SubscriptionService.checkout({
        pricingId: pricing.id,
        ...userDetail,
      });

      if (response?.data?.checkoutForm) {
        // Adjust the checkout form and redirect to the payment page
        setCheckoutForm(response.data.checkoutForm);
        clearPricing();
      } else {
        toast.error("Ödeme sayfasına yönlendirilemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onClick handler for Back button
  const handleClickBack = () => {
    navigate("/pricing");
  };

  return isSubscribed & !isFree || (!checkoutForm && !pricing) ? (
    <Navigate to="/pricing" />
  ) : (
    <Grid
      container
      item
      rowSpacing={4.5}
      columnSpacing={2.75}
      justifyContent="space-around"
    >
      {/* Toolbar */}
      <Grid item xs={12}>
        <SubscriptionToolbar index={2} />
      </Grid>

      {checkoutForm ? (
        <PaymentForm content={checkoutForm} />
      ) : (
        <Grid
          container
          item
          xs={12}
          sx={{
            padding: 4,
            marginLeft: 3,
            borderRadius: "8px",
            justifyContent: "center",
            backgroundColor: theme.palette.common.white,
          }}
        >
          {/* Pricing Card */}
          <Grid
            container
            direction="column"
            item
            xs={10}
            sm={9}
            md={4}
            sx={{
              padding: 2,
              borderRadius: "8px",
              backgroundColor: theme.palette.background.secondary,
            }}
          >
            {/* Back */}
            <Grid item>
              <Prev
                label={"Geri"}
                style={{
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.background.secondary,
                }}
                onClick={handleClickBack}
              />
            </Grid>
            {/* Card */}
            <Grid item xs p={3}>
              <PricingCard pricing={pricing} selected />
            </Grid>
            {/* Privacy */}
            <Grid item>
              <Typography variant="body2" align="center">
                <Link
                  href={POLICY_URL}
                  style={{
                    color: theme.palette.text.secondary,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Gizlilik
                </Link>{" "}
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    color: theme.palette.text.secondary,
                    padding: "0 0.5rem",
                    fontWeight: "lighter",
                  }}
                >
                  |
                </Typography>{" "}
                <Link
                  href={TERMS_URL}
                  style={{
                    color: theme.palette.text.secondary,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Kullanıcı Sözleşmesi
                </Link>
              </Typography>
            </Grid>
          </Grid>

          {/* BillingForm */}
          <Grid container item xs={10} sm={10} md={6} pt={2} px={4}>
            <BillingForm onSubmit={checkout} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default Checkout;
