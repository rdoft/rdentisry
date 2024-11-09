import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Dialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { useSubscription } from "context/SubscriptionProvider";

// assets
import { PremiumImage } from "assets/images/subscriptions";

function UpgradeDialog() {
  const navigate = useNavigate();
  const { hideDialog } = useSubscription();

  // HANDLERS ------------------------------------------------------------------
  // Redirect to the pricing page
  const redirect = () => {
    navigate("/pricing");
    hideDialog();
  };

  return (
    <Dialog
      header={
        <Box textAlign="center">
          <Typography variant="h3">Daha Fazlasını Keşfedin</Typography>
        </Box>
      }
      visible={true}
      position="center"
      style={{ width: "75vw" }}
      resizable={false}
      onHide={hideDialog}
      modal
      dismissableMask={false}
      footer={
        <Box display="flex" justifyContent="center">
          <DialogFooter
            labelSubmit="Planları Görüntüle"
            labelHide="Daha Sonra"
            onSubmit={redirect}
            onHide={hideDialog}
          />
        </Box>
      }
    >
      <Box p={2} display="flex" alignItems="center">
        <Box flex={1}>
          <Typography variant="h4" gutterBottom>
            Mevcut planınızda sınırları zorluyorsunuz! Yeni planlarla daha fazla
            imkana sahip olun.
          </Typography>

          <Typography variant="h6" mt={3}>
            <Box display="flex" alignItems="start" mb={1}>
              ✅<Box ml={1}>Daha fazla doktor ile ekibinizi güçlendirin</Box>
            </Box>
            <Box display="flex" alignItems="start" mb={1}>
              ✅<Box ml={1}>Daha fazla hasta ile hizmet ağınızı büyütün</Box>
            </Box>
            <Box display="flex" alignItems="start" mb={1}>
              ✅
              <Box ml={1}>
                Genişletilmiş depolama alanı ile tüm verilerinizi güvende tutun
              </Box>
            </Box>
            <Box display="flex" alignItems="start" mb={1}>
              ✅<Box ml={1}>Daha fazla SMS ile daha fazla hastaya ulaşın</Box>
            </Box>
          </Typography>
        </Box>
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={PremiumImage}
            alt="Premium"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}

export default UpgradeDialog;
