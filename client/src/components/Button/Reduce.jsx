import React from "react";
import { Tooltip } from "@mui/material";
import BaseButton from "./BaseButton";

function Reduce({ isReduce, onClick, ...props }) {
  return (
    <Tooltip
      title={isReduce ? "Tutar plandan eksiltilir" : "Tutar planı etkilemez"}
      placement="right"
      enterDelay={500}
    >
      <span>
        <BaseButton
          icon="pi pi-caret-down"
          variant={isReduce ? "main" : "text"}
          size="xsmall"
          onClick={onClick}
          {...props}
        />
      </span>
    </Tooltip>
  );
}

export default Reduce;
