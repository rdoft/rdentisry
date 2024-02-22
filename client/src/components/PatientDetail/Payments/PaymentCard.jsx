import React, { useState } from "react";
import { Button } from "primereact";
import { Grid } from "@mui/material";
import PaymentType from "./PaymentType";
import PaymentAmount from "./PaymentAmount";
import PaymentDateTag from "./PaymentDateTag";

function PaymentCard({ payment, onClickEdit, onSubmit, direction }) {
  const [isHover, setIsHover] = useState(false);

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
  const handlePay = () => {
    onSubmit({
      ...payment,
      actualDate: new Date(),
    });
  };

  // onClickCancel handler
  const handleCancel = () => {
    onSubmit({
      ...payment,
      actualDate: null,
    });
  };

  // TEMPLATES ----------------------------------------------------------------
  // Button for cancel payment
  const cancelButton = payment.plannedDate && payment.actualDate && (
    <Button
      text
      outlined
      size="small"
      icon="pi pi-times-circle"
      severity="danger"
      onClick={handleCancel}
      tooltip="İptal et"
    />
  );

  // Button for make payment
  const payButton = !payment.actualDate && (
    <Button
      text
      outlined
      size="small"
      icon="pi pi-check-circle"
      severity="success"
      onClick={handlePay}
      tooltip="Öde"
    />
  );

  return (
    <>
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
          onClick={handleClickEdit}
          className="border-2 surface-border border-round"
          style={{ backgroundColor: isHover && "#F3F4F5", cursor: "pointer" }}
        >
          <div className="flex flex-wrap justify-content-between pb-2">
            <PaymentDateTag
              actual={payment.actualDate}
              planned={payment.plannedDate}
              isPlanned={true}
            />
            <PaymentDateTag
              actual={payment.actualDate}
              planned={payment.plannedDate}
              isPlanned={false}
            />
          </div>
          <div className="flex flex-wrap align-item-center justify-content-center text-xl font-bold gap-1">
            <PaymentAmount amount={payment.amount} />
          </div>
          <div className="flex flex-wrap align-items-center justify-content-center text-xs font-light gap-1">
            <PaymentType type={payment.type} />
          </div>
        </Grid>
        {isHover && (
          <Grid item xs={2} px={1}>
            {payButton}
            {cancelButton}
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default PaymentCard;
