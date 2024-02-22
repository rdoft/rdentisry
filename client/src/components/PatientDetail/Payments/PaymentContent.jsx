import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Button, ConfirmDialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import ActionGroup from "components/ActionGroup/ActionGroup";
import PaymentAmount from "./PaymentAmount";

function PaymentContent({ payment, onClickEdit, onSubmit, onDelete }) {
  const [isHover, setIsHover] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

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
  const handleEdit = () => {
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

  // onDelete handler
  const handleDelete = () => {
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = () => {
    onDelete(payment);
    setIsDelete(false);
  };

  // onHideDelete handler
  const handleDeleteHide = () => {
    setIsDelete(false);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Pay button template
  const payButton = !payment.actualDate && (
    <Button
      text
      outlined
      size="small"
      icon="pi pi-check-circle"
      severity="success"
      onClick={handlePay}
      tooltip="Öde"
      tooltipOptions={{ position: "bottom" }}
    />
  );

  // Cancel payment button
  const cancelButton = payment.plannedDate && payment.actualDate && (
    <Button
      text
      outlined
      size="small"
      icon="pi pi-times-circle"
      severity="info"
      onClick={handleCancel}
      tooltip="İptal et"
      tooltipOptions={{ position: "bottom" }}
    />
  );

  // Delete confirm dialog
  const deleteDialog = (
    <ConfirmDialog
      visible={isDelete}
      onHide={handleDeleteHide}
      message=<Typography variant="body1">
        Ödemeyi silmek istediğinize emin misiniz?
      </Typography>
      header="Ödemeyi Sil"
      footer=<DialogFooter
        onHide={handleDeleteHide}
        onDelete={handleDeleteConfirm}
      />
    />
  );

  return (
    <>
      <Grid
        container
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Grid item xs={2}>
          <PaymentAmount amount={payment.amount} type={payment.type} />
        </Grid>
        {isHover && (
          <Grid item>
            <ActionGroup
              onClickEdit={handleEdit}
              onClickDelete={handleDelete}
            />
            
            {payButton}
            {cancelButton}
          </Grid>
        )}
      </Grid>
      {/* Confirm delete dialog */}
      {deleteDialog}
    </>
  );
}

export default PaymentContent;
