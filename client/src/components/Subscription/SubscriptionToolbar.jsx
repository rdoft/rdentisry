import React from "react";
import { Toolbar, Divider } from "primereact";
import { Typography, Stack } from "@mui/material";

function SubscriptionToolbar({ index }) {
  // TEMPLATES ------------------------------------------------------------------
  // Get title
  const getTitle = () => {
    let subtitle;
    switch (index) {
      case 1:
        subtitle = "Planlar (1 / 3)";
        break;
      case 2:
        subtitle = "Ödeme (2 / 3)";
        break;
      case 3:
        subtitle = "Sonuç (3 / 3)";
        break;
      default:
        subtitle = "Ödeme";
        break;
    }

    return (
      <Stack>
        <Typography variant="h3">Üyelik</Typography>
        <Typography variant="caption" style={{ color: "gray" }}>
          Üyelik{" "}
          <i className="pi pi-angle-right" style={{ fontSize: "0.7rem" }} />{" "}
          {subtitle}
        </Typography>
      </Stack>
    );
  };

  return (
    <>
      <Toolbar
        className="p-2 mt-1 mb-2"
        start={getTitle}
        style={{ border: "none" }}
      />
      <Divider className="m-1 p-1" />
    </>
  );
}

export default SubscriptionToolbar;
