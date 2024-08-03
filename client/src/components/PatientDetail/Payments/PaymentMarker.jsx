import { React } from "react";

// assets
import { useTheme } from "@mui/material/styles";

function PaymentMarker({ payment }) {
  const theme = useTheme();

  let color;
  let bcolor;
  let icon;

  if (payment.actualDate) {
    bcolor = theme.palette.text.success;
    color = "white";
    icon = "pi pi-circle-fill";
  } else if (payment.amount === payment.paid) {
    color = theme.palette.text.primary;
    icon = "pi pi-check";
  } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
    color = theme.palette.text.primary;
    icon = "pi pi-times";
  } else {
    color = theme.palette.text.primary;
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
