import React, { useState, useRef } from "react";
import { InputNumber } from "primereact";
import { Grid, Typography, ClickAwayListener } from "@mui/material";

function PriceColumn({ procedure, onSubmit }) {
  const prevPrice = useRef(procedure.price);
  const [isEdit, setIsEdit] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
  };

  // onChange handler
  const handleChange = (event) => {
    const value = event.value || 0;
    procedure.price = value;
  };

  // onSave handler, to save changes
  const handleSave = () => {
    setIsEdit(false);
    onSubmit(procedure);
  };

  // onCancel handler, discard changes to amount
  const handleCancel = () => {
    procedure.price = prevPrice.current;
    setIsEdit(false);
  };

  // onKeyDown handler, save the amount on Ctrl+Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  // handleClickAway handler, save the amount
  const handleClickAway = () => {
    handleSave();
  };

  return isEdit ? (
    <ClickAwayListener onClickAway={handleClickAway}>
      <InputNumber
        id="amount"
        value={procedure.price}
        mode="currency"
        min={0}
        currency="TRY"
        locale="tr-TR"
        style={{ height: "2.5rem" }}
        onValueChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </ClickAwayListener>
  ) : (
    <Grid container onClick={handleEdit}>
      <Typography variant="h6">₺</Typography>
      <Typography variant="h5" fontWeight="bold">
        {procedure.price.toLocaleString("tr-TR", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Grid>
  );
}

export default PriceColumn;
