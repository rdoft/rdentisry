import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { LoadingController } from "components/Loadable";
import { Loading } from "components/Other";
import {
  SubscriptionUpgradeDialog,
  SubscriptionCancelDialog,
} from "components/Dialog";
import PricingCard from "./PricingCard";
import SubscriptionToolbar from "./SubscriptionToolbar";

// services
import { SubscriptionService } from "services";

//TODO: Fix the sidebar active on subscription

function Pricing() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { pricing, selectPricing } = useSubscription();

  // Set the default values
  const [pricings, setPricings] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [dialog, setDialog] = useState({
    upgrade: false,
    cancel: false,
  });

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

  // SERVICES -------------------------------------------------------------------
  // Upgrade the subscription
  const upgrade = async () => {
    startLoading("save");
    try {
      await SubscriptionService.updateSubscription({ pricingId: pricing.id });
      const response = await SubscriptionService.getSubscription();
      setSubscription(response?.data || null);
      toast.success("Planınız başarıyla güncellendi.");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // Cancel the subscription
  const cancel = async () => {
    startLoading("save");
    try {
      await SubscriptionService.cancelSubscription();
      setSubscription(null);
      toast.success("Aboneliğiniz başarıyla iptal edildi.");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onSelect handler for the pricing card
  const handleSelect = (pricing) => {
    selectPricing(pricing);
    if (subscription) {
      setDialog({
        ...dialog,
        upgrade: true,
      });
    } else {
      navigate("/checkout");
    }
  };

  // onCancel handler for the subscription
  const handleCancel = () => {
    setDialog({
      ...dialog,
      cancel: true,
    });
  };

  // Hide the upgrade dialog
  const hideUpgradeDialog = () => {
    setDialog({
      ...dialog,
      upgrade: false,
    });
  };

  // Hide the cancel dialog
  const hideCancelDialog = () => {
    setDialog({
      ...dialog,
      cancel: false,
    });
  };

  // onSubmit handler for the upgrade dialog
  const handleUpgradeSubmit = async () => {
    if (pricing) {
      await upgrade();
    }
    setDialog({
      ...dialog,
      upgrade: false,
    });
  };

  // onSubmit handler for the cancel dialog
  const handleCancelSubmit = async () => {
    await cancel();
    setDialog({
      ...dialog,
      cancel: false,
    });
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
            xs={12}
            md={10}
            xl={8}
            spacing={4}
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
                  onSelect={handleSelect}
                  onCancel={handleCancel}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </LoadingController>

      {/* Dialog */}
      {dialog.upgrade && (
        <SubscriptionUpgradeDialog
          pricing={pricing}
          onSubmit={handleUpgradeSubmit}
          onHide={hideUpgradeDialog}
        />
      )}
      {dialog.cancel && (
        <SubscriptionCancelDialog
          onSubmit={handleCancelSubmit}
          onHide={hideCancelDialog}
        />
      )}
    </Grid>
  );
}

export default Pricing;
