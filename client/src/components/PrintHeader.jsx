import React from "react";
import { Grid, Typography } from "@mui/material";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

function PrintHeader({ patient }) {
  return (
    <Grid container className="print-only" mb={2} sx={{ display: "none" }}>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <Typography variant="caption">
            <strong>Kimlik Numarası:</strong> {patient.idNumber ?? ""}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">
            <strong>Ad Soyad:</strong> {patient.name} {patient.surname}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">
            <strong>Yaş:</strong>{" "}
            {patient.birthYear
              ? new Date().getFullYear() - patient.birthYear
              : ""}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">
            <strong>İletişim:</strong> {patient.phone}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <Grid container item justifyContent="end">
          <Logo style={{ width: "30%" }} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PrintHeader;
