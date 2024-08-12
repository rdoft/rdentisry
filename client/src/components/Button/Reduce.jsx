import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";
import { useLoading } from "context/LoadingProvider";

// assets
import { useTheme } from "@mui/material/styles";

function Reduce({ isReduce, onClick }) {
  const theme = useTheme();
  const { loading } = useLoading();

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
        loading={loading.save}
        onClick={onClick}
        className="flex align-items-center justify-content-center border-circle z-1"
        style={{
          color: theme.palette.text.primary,
          width: "1.6rem",
          height: "1.6rem",
        }}
      />
    </Tooltip>
  );
}

export default Reduce;
