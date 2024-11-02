import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { LoadingController } from "components/Loadable";
import { Loading } from "components/Other";
import { useTheme } from "@mui/material/styles";
import PricingCard from "./PricingCard";
import SubscriptionToolbar from "./SubscriptionToolbar";

// services
import { SubscriptionService } from "services";

function Pricing() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { selectPricing } = useSubscription();

  // Set the default values
  const [pricings, setPricings] = useState([]);
  const [subscription, setSubscription] = useState(null);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAll = async () => {
      startLoading("Pricing");

      try {
        const _pricings = await SubscriptionService.getPricings({ signal });
        setPricings(_pricings.data);

        const _subscription = await SubscriptionService.getSubscription({
          signal,
        });
        setSubscription(_subscription?.data || null);
      } catch (error) {
        error.message && toast.error(error.message);
      } finally {
        stopLoading("Pricing");
      }
    };
    fetchAll();

    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onClick handler for the pricing card
  const handleClick = (pricing) => {
    selectPricing(pricing);
    navigate("/checkout");
  };

  return (
    <Grid container item rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        {/* Toolbar */}
        <SubscriptionToolbar index={1} />
      </Grid>

      {/* Pricing Plan */}
      <LoadingController name="Pricing" skeleton={<Loading />}>
        <Grid
          container
          sx={{
            justifyContent: "center",
            backgroundColor: theme.palette.common.white,
            borderRadius: "8px",
            padding: 5,
            marginLeft: 3,
          }}
        >
          {/* Header */}
          <Grid item xs={11} textAlign="center">
            <Typography variant="h3" fontWeight="light">
              Kendinize uygun planı seçin.
            </Typography>
          </Grid>

          {/* Pricing Cards */}
          <Grid
            container
            item
            xs={11}
            md={10}
            lg={9}
            spacing={6}
            rowSpacing={6}
            mt={2}
            justifyContent="center"
            alignItems="end"
          >
            {pricings.map((pricing) => (
              <Grid item xs={10} sm={7} md={4} key={pricing.id}>
                <PricingCard
                  pricing={pricing}
                  subscription={
                    subscription?.pricingId === pricing.id && subscription
                  }
                  onClick={handleClick}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </LoadingController>
    </Grid>
  );
}

export default Pricing;
