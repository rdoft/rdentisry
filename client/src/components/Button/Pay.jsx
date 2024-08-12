import React from "react";
import { Button } from "primereact";
import { Tooltip } from "@mui/material";
import { useLoading } from "context/LoadingProvider";

function Pay({ label, onClick, ...props }) {
  const { loading } = useLoading();

  return (
    <Tooltip title="Öde" placement="bottom" enterDelay={500}>
      <Button
        text
        outlined
        size="small"
        loading={loading.save}
        label={!loading.save ? label : ""}
        severity={props.severity || "success"}
        onClick={onClick}
        style={props.style}
      />
    </Tooltip>
  );
}

export default Pay;
