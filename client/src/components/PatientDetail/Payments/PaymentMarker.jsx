import { React } from "react";

function PaymentMarker({ payment }) {
  let color;
  let icon;
  if (payment.actualDate) {
    color = "#22A06A";
    icon = "pi pi-check";
  } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
    color = "#EF4444";
    icon = "pi pi-times";
  } else {
    color = "#1E7AFC";
    icon = "pi pi-stopwatch";
  }

  return (
    <span
      className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
      style={{ backgroundColor: color }}
    >
      <i className={icon}></i>
    </span>
  );
}

export default PaymentMarker;
