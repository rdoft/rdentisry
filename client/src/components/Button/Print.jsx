import React from "react";
import { Tooltip } from "@mui/material";
import BaseButton from "./BaseButton";

function Print({ label, onClick, ...props }) {
  return (
    <Tooltip title="PDF" placement="bottom" enterDelay={750}>
      <span>
        <BaseButton
          variant="outlined"
          size="small"
          icon="pi pi-print"
          label={label}
          onClick={onClick}
          style={{
            ...props.style,
          }}
          {...props}
        />
      </span>
    </Tooltip>
  );
}

export default Print;
