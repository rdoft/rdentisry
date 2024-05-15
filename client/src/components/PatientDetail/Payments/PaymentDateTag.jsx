import React from "react";
import { Tag } from "primereact";

function PaymentDateTag({ payment }) {
  let color;
  let bgColor;
  let label;

  if (payment.actualDate) {
    color = "#A44800";
    bgColor = "#FFFADD";
    label = new Date(payment.actualDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (payment.amount === payment.paid) {
    color = "#22A06A";
    bgColor = "#DFF6EC";
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
    color = "#EF4444";
    bgColor = "#FFD2CB";
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    color = "#1E7AFC";
    bgColor = "#E8F0FF";
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
