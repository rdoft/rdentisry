import React from "react";
import { Tag } from "primereact";

function PaymentDateTag({ payment }) {
  let color;
  let bgColor;
  let label;

  if (payment.actualDate) {
    color = "#22A06A";
    bgColor = "#DFF6EC";
    label = new Date(payment.actualDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (payment.amount === payment.paid) {
    color = "#172B4D";
    bgColor = "#F3F4F5";
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
    color = "#172B4D";
    bgColor = "#F3F4F5";
    label = new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    color = "#172B4D";
    bgColor = "#F3F4F5";
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
