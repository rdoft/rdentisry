import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact";
import { Box, Typography, ClickAwayListener, useTheme } from "@mui/material";
import { useSubscription } from "context/SubscriptionProvider";
import { DialogFooter } from "components/DialogFooter";
import { cacheImages } from "utils";
import config from "config/theme.config";

// assets
import { PremiumImage } from "assets/images/subscriptions";
cacheImages([PremiumImage]);

function PremiumDialog() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { hideDialog } = useSubscription();
  const dialogZIndex = theme.zIndex?.dialog || config.zIndex?.dialog || 1400;

  // HANDLERS ------------------------------------------------------------------
  // Redirect to the pricing page
  const redirect = () => {
    navigate("/pricing");
    hideDialog();
  };

  // onClickAway handler
  const handleClickAway = () => {
    hideDialog();
  };

  // mouseClick handler
  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Dialog
        visible
        modal
        className="p-fluid"
        position="center"
        style={{
          zIndex: dialogZIndex,
        }}
        onHide={hideDialog}
        onClick={handleClick}
        footer={
          <DialogFooter
            labelSubmit="Abonelik Planları"
            labelHide="Kapat"
            onHide={hideDialog}
            onSubmit={redirect}
          />
        }
        maskStyle={{
          backdropFilter: "blur(4px)",
          backgroundColor: theme.palette.background.default,
          zIndex: dialogZIndex - 1,
        }}
        breakpoints={{ "960px": "80vw", "640px": "90vw" }}
        blockScroll
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <img
            src={PremiumImage}
            alt="Premium"
            style={{ width: "100%", maxWidth: 400, marginBottom: 16 }}
          />
          <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
            Aboneliğinizi Yükseltin
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Daha fazlası için abonelik planınızı yükseltin.
          </Typography>
        </Box>
      </Dialog>
    </ClickAwayListener>
  );
}

export default PremiumDialog;
