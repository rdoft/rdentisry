import React, { useState } from "react";
import { Tag, Button } from "primereact";
import { Grid, Typography } from "@mui/material";

import ActionGroup from "components/ActionGroup/ActionGroup";

function PaymentCard({ payment, onClickEdit, onClickPay, direction }) {
  const [isHover, setIsHover] = useState(false);

  // Payment types
  const paymentTypes = [
    { value: "cash", label: "Nakit", icon: "pi pi-wallet" },
    { value: "card", label: "Kredi Kartı", icon: "pi pi-credit-card" },
    {
      value: "transfer",
      label: "Transfer(Banka)",
      icon: "pi pi-arrow-right-arrow-left",
    },
    { value: "other", label: "Diğer", icon: "pi pi-file" },
  ];

  // HANDLERS -----------------------------------------------------------------
  // onMouseEnter handler for display buttons
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  // onMouseLeave handler for hide buttons
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // onClickEdit handler
  const handleClickEdit = () => {
    onClickEdit(payment);
  };

  // onClickPay handler
  const handleClickPay = () => {
    if (!payment.actualDate) {
      payment.actualDate = new Date();
      onClickPay(payment);
    }
  };

  // TEMPLATES ----------------------------------------------------------
  // Set label of the paymentType
  const type = () => {
    const type_ = paymentTypes.find((item) => item.value === payment.type);

    return (
      type_ && (
        <>
          <i className={type_.icon} style={{ fontSize: "0.7rem" }}></i>
          <span>{type_.label}</span>
        </>
      )
    );
  };

  // Set amount of payment
  const amount = () => {
    return (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item pr={0.5}>
          <Typography variant="h6">₺</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3" fontWeight="light">
            {payment.amount.toLocaleString("tr-TR", {
              style: "decimal",
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  // plannedDate Tag item
  const plannedDateTag = () => {
    let visibility = payment.plannedDate ? "visible" : "hidden";
    let label =
      payment.plannedDate &&
      new Date(payment.plannedDate).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
      <Tag
        value={label}
        style={{ backgroundColor: "#E8F0FF", color: "#1E7AFC", visibility: visibility }}
      />
    );
  };

  // actualDate Tag item
  const actualDateTag = () => {
    let label;
    let color;
    let bgColor;

    if (payment.actualDate) {
      color = "#22A069";
      bgColor = "#DFFCF0";
      label = new Date(payment.actualDate).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (new Date(payment.plannedDate).getTime() < new Date().getTime()) {
      color = "#EF4444"
      bgColor = "#FFD2CB";
      label = "Gecikti";
    } else {
      color = "#1E7AFC"
      bgColor = "#E8F0FF";
      label = "Bekleniyor";
    }

    return <Tag value={label} style={{ backgroundColor: bgColor, color: color }} />;
  };

  // Action button for pay
  const payButton = () => {
    if (!payment.actualDate) {
      return (
        <Button
          text
          outlined
          size="sm"
          icon="pi pi-check-circle"
          severity="secondary"
          onClick={handleClickPay}
        />
      );
    }
  };

  return (
    <Grid
      container
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      direction={direction}
      alignItems="center"
    >
      <Grid
        item
        xs={9}
        p={3}
        className="border-1 surface-border surface-card border-round"
      >
        <div className="flex flex-wrap justify-content-between pb-2">
          {plannedDateTag()}
          {actualDateTag()}
        </div>
        <div className="flex flex-wrap align-item-center justify-content-center text-xl font-bold gap-1">
          {amount()}
        </div>
        <div className="flex flex-wrap align-items-center justify-content-center text-xs font-light gap-1">
          {type()}
        </div>
      </Grid>
      {isHover && (
        <Grid item xs={2} px={1}>
          <ActionGroup onClickEdit={handleClickEdit} custom={payButton()} />
        </Grid>
      )}
    </Grid>
  );
}

export default PaymentCard;
