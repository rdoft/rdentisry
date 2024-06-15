import React from "react";
import { Grid } from "@mui/material";
import { SplitButton } from "primereact";

function SplitItem({ label, options, onClick }) {
  return (
    <Grid item xs={12} mt={3} style={{ textAlign: "center" }}>
      <SplitButton
        text
        outlined
        size="small"
        icon="pi pi-plus"
        label={label}
        menuStyle={{ borderRadius: "0.5rem", color: "#182A4D" }}
        model={options}
        onClick={onClick}
      />
    </Grid>
  );
}

export default SplitItem;
