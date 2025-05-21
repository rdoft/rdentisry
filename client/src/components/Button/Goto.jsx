import React from "react";
import { Tooltip } from "@mui/material";
import BaseButton from "./BaseButton";

function Goto({ label, onClick, tooltip, ...props }) {
  return (
    <Tooltip title={tooltip} placement="bottom" enterDelay={750}>
      <span>
        <BaseButton
          icon="pi pi-arrow-circle-right"
          label={label}
          onClick={onClick}
          variant="outlined"
          size="medium"
          {...props}
        />
      </span>
    </Tooltip>
  );
}

export default Goto;
