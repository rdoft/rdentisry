import React from "react";
import { Grid } from "@mui/material";
import Add from "./Add";

function NewItem({ label, onClick }) {
  return (
    <Grid item xs={12} mt={3} style={{ textAlign: "center" }}>
      <Add label={label} onClick={onClick} style={{ color: "#182A4D" }} />
    </Grid>
  );
}

export default NewItem;
