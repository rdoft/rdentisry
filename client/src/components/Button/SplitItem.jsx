import React from "react";
import { Grid } from "@mui/material";
import { SplitButton } from "primereact";

function SplitItem({ label, options, onClick, ...props }) {
  return (
    <Grid item xs="auto" mt={props?.mt ?? 3} style={{ textAlign: "center" }}>
      <SplitButton
        outlined
        size="small"
        icon="pi pi-plus"
        label={label}
        model={options}
        onClick={onClick}
        className="splitbutton-custom"
      />
    </Grid>
  );
}

export default SplitItem;
