import React, { useState, useRef } from "react";
import { Grid, Typography } from "@mui/material";
import { ConfirmDialog, Menu } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { Delete, Pay, More, Basic } from "components/Button";
import { SubscriptionController } from "components/Subscription";
import PaymentAmount from "./PaymentAmount";

function PaymentContent({ payment, onClickEdit, onSubmit, onDelete }) {
  const [isDelete, setIsDelete] = useState(false);
  const menu = useRef(null);

  // HANDLERS -----------------------------------------------------------------
  // onClickEdit handler
  const handleEdit = () => {
    onClickEdit(payment);
  };

  // onClickPay handler
  const handlePay = async () => {
    await onSubmit({
      patient: payment.patient,
      amount: payment.amount - payment.paid,
      actualDate: new Date(),
      isPlanned: true,
    });
  };

  //  onClick isPlanned handler
  const handleChangeReduce = (checked) => {
    onSubmit({
      ...payment,
      isPlanned: checked,
    });
  };

  // onDelete handler
  const handleDelete = () => {
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = async () => {
    await onDelete(payment);
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

  // Action button with menu
  const actionButton = (
    <>
      <More
        variant="text"
        severity="secondary"
        size="small"
        onClick={(event) => {
          menu.current.toggle(event);
        }}
      />
      <Menu
        model={[
          {
            template: () => (
              <Basic
                label="Görüntüle / Düzenle"
                icon="pi pi-external-link"
                onClick={(event) => {
                  menu.current.toggle(event);
                  handleEdit();
                }}
              />
            ),
          },
          ...(payment.plannedDate && payment.amount > payment.paid
            ? [
                {
                  template: () => (
                    <SubscriptionController
                      type="storage"
                      style={{ width: "100%" }}
                    >
                      <Pay
                        label={`Öde (₺${payment.amount - payment.paid})`}
                        style={{ width: "100%", textAlign: "start" }}
                        onClick={(event) => {
                          menu.current.toggle(event);
                          handlePay();
                        }}
                      />
                    </SubscriptionController>
                  ),
                },
              ]
            : []),
          {
            template: () => (
              <SubscriptionController style={{ width: "100%" }}>
                <Delete
                  label="Sil"
                  style={{ width: "100%", textAlign: "start" }}
                  onClick={(event) => {
                    menu.current.toggle(event);
                    handleDelete();
                  }}
                />
              </SubscriptionController>
            ),
          },
        ]}
        ref={menu}
        id="popup_menu"
        popup
        style={{ padding: "0.25rem" }}
      />
    </>
  );

  return (
    <>
      <Grid container gap={0.25} pb={4} ml={-1}>
        <Grid item xs="auto">
          {actionButton}
        </Grid>
        <Grid item xs>
          {payment.plannedDate ? (
            <PaymentAmount amount={payment.amount} paid={payment.paid} />
          ) : (
            <PaymentAmount
              amount={payment.amount}
              isReduce={payment.isPlanned}
              onChange={handleChangeReduce}
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
