import React from "react";
import { Grid } from "@mui/material";
import Add from "./Add";

function NewItem({ label, onClick, ...props }) {
  return (
    <Grid item xs={12} mt={props?.mt ?? 3} style={{ textAlign: "center" }}>
      <Add border label={label} onClick={onClick} />
    </Grid>
  );
}

export default NewItem;
