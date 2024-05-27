import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { Cancel } from "components/Button";

function InvoicePrice({ invoice, onSubmit }) {
  const prevPrice = useRef(invoice.price);
  const [price, setPrice] = useState(invoice.price);
  const [isEdit, setIsEdit] = useState(false);

  // Update component state when invoice prop changes
  useEffect(() => {
    setPrice(invoice.price);
    prevPrice.current = invoice.price;
  }, [invoice]);

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
  };

  // onChange handler
  const handleChange = (event) => {
    setPrice(event.value || 0);
  };

  // onSave handler, to save changes
  const handleSave = () => {
    prevPrice.current = price;
    setIsEdit(false);
    onSubmit(price);
  };

  // onCancel handler, discard changes to amount
  const handleCancel = () => {
    setPrice(prevPrice.current);
    setIsEdit(false);
  };

  // onKeyDown handler, save the amount on Ctrl+Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSave();
    else if (event.key === "Escape") handleCancel();
  };

  // handleClickAway handler, save the amount
  const handleClickAway = () => {
    handleSave();
  };

  return isEdit ? (
    <Grid container alignItems="center" m={"-16px"}>
      <Grid item xs={10} my={1}>
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
            inputStyle={{ padding: "8px", textAlign: "right" }}
            style={{ padding: "2px" }}
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
    <Tooltip title="Tutarı düzenle" placement="bottom-start" enterDelay={500}>
      <Grid
        container
        item
        onClick={handleEdit}
        justifyContent="end"
        xs={10}
        p={1}
        m={-1}
        sx={{
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Typography variant="h5" fontWeight="bolder">
          Toplam: ₺
          {price.toLocaleString("tr-TR", {
            style: "decimal",
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Grid>
    </Tooltip>
  );
}

export default InvoicePrice;
