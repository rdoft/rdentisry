import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";

function Reduce({ isReduce, onClick }) {
  return (
    <Tooltip
      title={
        isReduce
          ? "Ödeme tutarı plandan eksiltilir"
          : "Ödeme tutarı planı etkilemez"
      }
      placement="right"
      enterDelay={500}
    >
      <Button
        icon={isReduce ? "pi pi-check" : "pi pi-circle-fill"}
        rounded
        outlined
        onClick={onClick}
        className="flex align-items-center justify-content-center border-circle z-1"
        style={{ color: "#172B4D", width: "1.6rem", height: "1.6rem" }}
      />
    </Tooltip>
  );
}

export default Reduce;
