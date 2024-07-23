import { React } from "react";

function PaymentMarker({ payment }) {
  let color;
  let bcolor;
  let icon;

  if (payment.actualDate) {
    bcolor = "#22A06A";
    color = "white"
    icon = "pi pi-circle-fill";
  } else if (payment.amount === payment.paid) {
    color = "#172B4D";
    icon = "pi pi-check";
  } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
    color = "#172B4D";
    icon = "pi pi-times";
  } else {
    color = "#172B4D";
    icon = "pi pi-stopwatch";
  }

  return (
    <span
      className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-3"
      style={{ backgroundColor: bcolor, color: color }}
    >
      <i className={icon}></i>
    </span>
  );
}

export default PaymentMarker;
