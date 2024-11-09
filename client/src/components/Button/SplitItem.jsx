import React from "react";
import { Grid, Tooltip } from "@mui/material";
import { SplitButton } from "primereact";

function SplitItem({ label, options, onClick, tooltip, ...props }) {
  return (
    <Tooltip title={tooltip} placement="bottom" enterDelay={500}>
      <Grid item xs="auto" style={{ textAlign: "center" }}>
        <SplitButton
          outlined
          size="small"
          icon="pi pi-plus"
          label={label}
          model={options}
          onClick={onClick}
          disabled={props?.disabled}
          className="splitbutton-custom"
        />
      </Grid>
    </Tooltip>
  );
}

export default SplitItem;
