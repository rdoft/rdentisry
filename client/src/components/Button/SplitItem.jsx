import React from "react";
import { Grid } from "@mui/material";
import { SplitButton } from "primereact";

function SplitItem({ label, options, onClick, onSelect }) {
  // options hanlder of SplitButton
  const visitOptions = options.map((item) => ({
    label: `📌 ${item.title}`,
    command: () => onSelect(item),
  }));

  return (
    <Grid item xs={12} mt={3} style={{ textAlign: "center" }}>
      <SplitButton
        text
        outlined
        size="small"
        icon="pi pi-plus"
        label={label}
        menuStyle={{ borderRadius: "0.5rem", color: "#182A4D" }}
        model={visitOptions}
        onClick={onClick}
      />
    </Grid>
  );
}

export default SplitItem;
