import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { ConfirmDialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { Edit, Delete, Pay } from "components/Button";
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
      patient: payment.patient,
      amount: payment.amount - payment.paid,
      actualDate: new Date(),
      isPlanned: true,
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
        paddingBottom={4}
      >
        <Grid item xs={12}>
          {payment.plannedDate ? (
            <PaymentAmount amount={payment.amount} paid={payment.paid} />
          ) : (
            <PaymentAmount amount={payment.amount} type={payment.type} />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          style={{ visibility: isHover ? "visible" : "hidden" }}
        >
          {/* Edit button */}
          <Edit onClick={handleEdit} />

          {/* Delete button */}
          <Delete onClick={handleDelete} />

          {/* Pay button */}
          {payment.plannedDate && payment.amount > payment.paid && (
            <Pay
              label={"₺" + (payment.amount - payment.paid)}
              onClick={handlePay}
            />
          )}
        </Grid>
      </Grid>
      {/* Confirm delete dialog */}
      {deleteDialog}
    </>
  );
}

export default PaymentContent;
