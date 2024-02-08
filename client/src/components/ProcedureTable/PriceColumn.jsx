import React, { useState, useRef } from "react";
import { InputNumber, Button } from "primereact";
import { Grid, Typography, ClickAwayListener } from "@mui/material";

function PriceColumn({ procedure, onSubmit }) {
  const prevPrice = useRef(procedure.price);
  const [isEdit, setIsEdit] = useState(false);
  const [price, setPrice] = useState(procedure.price);

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
  };

  // onChange handler
  const handleChange = (event) => {
    const value = event.value || 0;
    setPrice(value);
  };

  // onSave handler, to save changes
  const handleSave = () => {
    prevPrice.current = price;
    procedure.price = price;
    onSubmit(procedure);
    setIsEdit(false);
  };

  // onCancel handler, discard changes to amount
  const handleCancel = () => {
    setPrice(prevPrice.current);
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
    <Grid container alignItems="center" m={"-16px"}>
      <Grid item xs={9} m={1}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <InputNumber
            id="price"
            value={price}
            mode="currency"
            min={0}
            currency="TRY"
            locale="tr-TR"
            variant="outlined"
            autoFocus={true}
            className="w-full"
            inputStyle={{ padding: "8px" }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </ClickAwayListener>
      </Grid>
      <Grid item xs>
        <Button
          icon="pi pi-times"
          size="small"
          severity="secondary"
          text
          onClick={handleCancel}
        />
      </Grid>
    </Grid>
  ) : (
    <Grid container onClick={handleEdit}>
      <Typography variant="h6">₺</Typography>
      <Typography variant="h5" fontWeight="bold">
        {price.toLocaleString("tr-TR", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Grid>
  );
}

export default PriceColumn;
