import React, { useState, useRef } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { CardTitle } from "components/cards";
import { Cancel } from "components/Button";

function PriceColumn({ procedure, onSubmit, isEdit, setIsEdit }) {
  const prevPrice = useRef(procedure.invoice.amount);
  const [price, setPrice] = useState(procedure.invoice.amount);

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
    setIsEdit(false);
    onSubmit({
      ...procedure,
      invoice: {
        ...procedure.invoice,
        amount: price,
      },
    });
  };

  // onCancel handler, discard changes to amount
  const handleCancel = () => {
    setPrice(prevPrice.current);
    setIsEdit(false);
  };

  // onKeyDown handler,
  // save the amount on Ctrl+Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
    event.stopPropagation();
  };

  // handleClickAway handler, save the amount
  const handleClickAway = () => {
    handleSave();
  };

  return isEdit ? (
    <Grid container alignItems="center" m={"-16px"}>
      <Grid item xs="auto">
        <ClickAwayListener onClickAway={handleClickAway}>
          <InputNumber
            id="price"
            value={price}
            mode="currency"
            size="10"
            min={0}
            currency="TRY"
            locale="tr-TR"
            variant="outlined"
            autoFocus={true}
            className="w-full"
            inputStyle={{ padding: "4px" }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </ClickAwayListener>
      </Grid>
      <Grid item xs>
        <Cancel onClick={handleCancel} />
      </Grid>
    </Grid>
  ) : (
    <Tooltip title="Fiyatı düzenle" placement="bottom-start" enterDelay={500}>
      <Grid container onClick={handleEdit}>
        <CardTitle variant="h6" style={{ padding: 0.8 }}>
          <Typography variant="caption">₺</Typography>
          {price.toLocaleString("tr-TR", {
            style: "decimal",
            maximumFractionDigits: 2,
          })}
        </CardTitle>
      </Grid>
    </Tooltip>
  );
}

export default PriceColumn;
