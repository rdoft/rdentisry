import React, { useState, useRef } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { Cancel } from "components/Button";

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
    setIsEdit(false);
    onSubmit({
      ...procedure,
      price: price,
    });
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
      <Grid item xs={9}>
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
            inputStyle={{ padding: "8px" }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </ClickAwayListener>
      </Grid>
      <Grid item xs={2}>
        <Cancel onClick={handleCancel} />
      </Grid>
    </Grid>
  ) : (
    <Tooltip title="Fiyatı düzenle" placement="bottom-start" enterDelay={500}>
      <Grid
        container
        item
        onClick={handleEdit}
        xs={9}
        p={1}
        m={-1}
        sx={{
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "white",
          },
        }}
      >
        <Typography variant="h6">₺</Typography>
        <Typography variant="h5" fontWeight="bolder">
          {price.toLocaleString("tr-TR", {
            style: "decimal",
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Grid>
    </Tooltip>
  );
}

export default PriceColumn;
