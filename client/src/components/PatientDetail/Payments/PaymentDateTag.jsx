import React from "react";
import { Tag } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function PaymentDateTag({ payment }) {
  const theme = useTheme();

  let color;
  let bgColor;
  let label;

  if (payment.actualDate) {
    color = theme.palette.text.success;
    bgColor = theme.palette.background.success;
    label = new Date(payment.actualDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (payment.amount === payment.paid) {
    color = theme.palette.text.primary;
    bgColor = theme.palette.background.primary;
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
    color = theme.palette.text.primary;
    bgColor = theme.palette.background.primary;
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    color = theme.palette.text.primary;
    bgColor = theme.palette.background.primary;
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Tag
      value={label}
      style={{
        color: color,
        backgroundColor: bgColor,
      }}
    />
  );
}

export default PaymentDateTag;
