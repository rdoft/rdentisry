import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import { Divider } from "primereact";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useLoading } from "context/LoadingProvider";
import { LoadingController } from "components/Loadable";
import { Loading } from "components/Other";
import { Copy } from "components/Button";

// services
import { UserService } from "services";


function ReferDialog({ onHide }) {
  const qrRef = useRef(null);
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();

  const [referralLink, setReferralLink] = useState("");
  const [referredCount, setReferredCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("ReferDialog");
    UserService.getReferralCode({ signal })
      .then((response) => {
        setReferredCount(response.data.referredCount ?? 0);
        setReferralLink(response.data.referralLink);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("ReferDialog"));

    return () => controller.abort();
  }, [startLoading, stopLoading]);

  // HANDLERS -------------------------------------------------------------------
  // onCopy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Kopyalandı");
  };

  // onCopyQR handler
  const handleCopyQR = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => {
            toast.success("Kopyalandı");
          })
          .catch(() => {
            toast.error("Kopyalanamadı");
          });
      });
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Dialog
      open
      onClose={onHide}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle
        textAlign="center"
        variant="h2"
        fontWeight="light"
        mt={1}
        mb={2}
      >
        <Stack textAlign="start">
          <Typography variant="h3" mb={2}>
            Paylaş, Kazan
          </Typography>
          <Typography
            variant="h5"
            fontWeight="light"
            style={{ color: theme.palette.grey[600] }}
          >
            Senin davet bağlantın ile uygulamaya katılıp abonelik satın alan
            arkadaşların için ödüller kazan:
          </Typography>
          <Typography
            variant="h6"
            fontWeight="light"
            style={{ color: theme.palette.grey[600] }}
          >
            • Sen, <b>200</b> SMS, <b>100</b> Hasta Kontenjanı
          </Typography>
          <Typography
            variant="h6"
            fontWeight="light"
            style={{ color: theme.palette.grey[600] }}
          >
            • Arkadaşın, <b>100</b> SMS, <b>200</b> Hasta Kontenjanı
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <LoadingController name="ReferDialog" skeleton={<Loading />}>
          <Grid container spacing={1}>
            {/* Referral Link */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold">
                Davet bağlantın:
              </Typography>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                value={referralLink}
                InputProps={{
                  readOnly: true,
                  sx: {
                    borderRadius: "10px",
                    color: "text.primary",
                    fontWeight: "light",
                  },
                }}
              />
            </Grid>
            <Grid item xs="auto">
              <Copy label="Kopyala" onClick={handleCopy} />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Divider type="solid" align="center">
                <Typography variant="h6">QR kodunu paylaş</Typography>
              </Divider>
            </Grid>

            {/* QR Code */}
            <Grid item xs={12} textAlign="center">
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Box
                    ref={qrRef}
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      padding: "15px",
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    <QRCodeSVG value={referralLink} size={150} />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Copy label="QR Kopyala" onClick={handleCopyQR} />
                </Grid>
              </Grid>
            </Grid>

            {/* Referred Count */}
            <Grid item xs={12} mt={2}>
              <Box
                sx={{
                  borderRadius: "10px",
                  padding: "16px",
                  backgroundColor: theme.palette.background.secondary,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color={theme.palette.text.secondary}
                >
                  {referredCount} kişi senin davetin ile abone oldu
                </Typography>

                <Typography variant="body2" color={theme.palette.grey[700]}>
                  *Kampanya 5 kişiye kadar geçerlidir.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </LoadingController>
      </DialogContent>
    </Dialog>
  );
}

export default ReferDialog;
