import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { Cancel } from "components/Button";

function VisitPrice({ visit, onSubmit }) {
  const prevPrice = useRef(visit.price);
  const [price, setPrice] = useState(visit.price);
  const [isEdit, setIsEdit] = useState(false);

  // Update component state when visit prop changes
  useEffect(() => {
    setPrice(visit.price);
    prevPrice.current = visit.price;
  }, [visit]);

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
    <Tooltip
      title={
        visit.approvedDate
          ? "Tedavi planı onaylandı, toplam tutar değiştirilemez"
          : "Tutarı düzenle"
      }
      placement="bottom-start"
      enterDelay={500}
    >
      <Grid
        container
        item
        onClick={!visit.approvedDate ? handleEdit : undefined}
        justifyContent="end"
        xs={10}
        p={1}
        m={-1}
        sx={{
          borderRadius: "8px",
          color: visit.approvedDate ? "#22A069" : "inherit",
          "&:hover": {
            backgroundColor: visit.approvedDate ? "inherit" : "#f5f5f5",
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

export default VisitPrice;
