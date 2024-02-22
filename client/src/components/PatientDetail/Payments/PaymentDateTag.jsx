import React from "react";
import { Tag } from "primereact";

function PaymentDateTag({ actual, planned }) {
  let color;
  let bgColor;
  let label;

  if (actual) {
    color = "#22A069";
    bgColor = "#DFFCF0";
    label = new Date(actual).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (new Date(planned).getTime() < new Date().getTime()) {
    color = "#EF4444";
    bgColor = "#FFD2CB";
    label = new Date(planned).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    color = "#1E7AFC";
    bgColor = "#E8F0FF";
    label = new Date(planned).toLocaleDateString("tr-TR", {
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
