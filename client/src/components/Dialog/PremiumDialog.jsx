import React from "react";
import { usePremium } from "context/PremiumProvider";
import { Dialog } from "primereact";
import { Typography, Grid } from "@mui/material";
import { PriceCard } from "components/cards";
import { Basic } from "components/Button";

function PremiumDialog() {
  const { isPremium, hidePremium } = usePremium();

  const { title, description } = {
    title: "Üyelik.",
    description:
      "Üyelik planlarımızdan birine abone olarak daha fazla özelliğe erişin.",
  };

  const featureBox1 = [
    "1 doktor.",
    "75 hasta kaydına kadar ücretsiz lisans.",
    "Tüm temel işlevselliklere erişim.",
  ];
  const featureBox2 = [
    "1 doktor.",
    "1000 hasta kaydına kadar lisans.",
    "Tüm işlevselliklere erişim.",
  ];
  const featureBox3 = [
    "Doktor sayısına bağlıdır.",
    "Tüm işlevselliklere erişim.",
    "dishekime@gmail.com",
  ];

  // TEMPLATE -----------------------------------------------------------------
  const footer = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Basic
          label={"Kapat"}
          onClick={hidePremium}
          style={{ backgroundColor: "transparent" }}
        />
      </div>
    );
  };

  return (
    <Dialog
      modal
      className="p-fluid"
      visible={isPremium}
      onHide={hidePremium}
      footer={footer}
      style={{ zIndex: 1110000, width: "90%" }}
    >
      <Grid container textAlign="center">
        <Grid item xs={12}>
          <Typography variant="h1" fontWeight="regular">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="light" sx={{ mt: 2 }}>
            {description}
          </Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" sx={{ mt: 4, p: 1 }}>
        <Grid
          item
          xs={10}
          md={3.7}
          m={1}
          style={{
            color: "white",
            backgroundColor: "#1D1D1F",
            borderRadius: "1rem",
          }}
        >
          <PriceCard price="₺0" title="Ücretsiz." feature={featureBox1} />
        </Grid>
        <Grid
          item
          xs={10}
          md={3.7}
          m={1}
          style={{
            color: "#1D1D1F",
            backgroundColor: "#F5F6F7",
            borderRadius: "1rem",
          }}
        >
          <PriceCard feature={featureBox2} price="₺1500" title="Hekim." />
        </Grid>
        <Grid
          item
          xs={10}
          md={3.7}
          m={1}
          style={{
            color: "white",
            backgroundColor: "#171D58",
            borderRadius: "1rem",
          }}
        >
          <PriceCard
            feature={featureBox3}
            price="Özel Fiyatlandırma"
            title="Klinik."
          />
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default PremiumDialog;
