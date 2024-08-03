import React, { useState, useRef } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { Cancel } from "components/Button";

// assets
import { useTheme } from "@mui/material/styles";

function PriceColumn({ procedure, onSubmit }) {
  const theme = useTheme();

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
      <Grid item xs={10}>
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
            inputStyle={{ padding: "4px 8px" }}
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
    <Tooltip
      title={
        procedure.visit.approvedDate
          ? "Seans onaylandı, tedavi ücreti değiştirilemez"
          : "Tutarı düzenle"
      }
      placement="bottom-start"
      enterDelay={500}
    >
      <Grid
        container
        item
        onClick={!procedure.visit.approvedDate ? handleEdit : undefined}
        xs={10}
        py={0.5}
        pl={1}
        m={-1}
        sx={{
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: procedure.visit.approvedDate
              ? "inherit"
              : theme.palette.background.primary,
          },
        }}
      >
        <Typography variant="h6">₺</Typography>
        <Typography variant="h5">
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
