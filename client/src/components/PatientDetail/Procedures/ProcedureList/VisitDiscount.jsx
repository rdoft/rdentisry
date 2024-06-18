import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { Cancel } from "components/Button";

function VisitDiscount({ visit, onSubmit }) {
  const prevDiscount = useRef(visit.discount);
  const [discount, setDiscount] = useState(visit.discount);
  const [isEdit, setIsEdit] = useState(false);

  // Update component state when visit prop changes
  useEffect(() => {
    if (!isEdit) {
      setDiscount(visit.discount);
      prevDiscount.current = visit.discount;
    }
  }, [visit, isEdit]);

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
  };

  // onChange handler
  const handleChange = (event) => {
    setDiscount(event.value || 0);
  };

  // onSave handler, to save changes
  const handleSave = () => {
    prevDiscount.current = discount;
    setIsEdit(false);
    onSubmit(discount);
  };

  // onCancel handler, discard changes to amount
  const handleCancel = () => {
    setDiscount(prevDiscount.current);
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
            id="discount"
            value={discount}
            mode="decimal"
            prefix="%"
            maxFractionDigits={2}
            min={0}
            max={100}
            variant="outlined"
            autoFocus={true}
            className="w-full"
            inputStyle={{
              padding: "8px",
              textAlign: "right",
              fontSize: "0.875rem",
            }}
            style={{ padding: "1px" }}
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
          ? "Tedavi planı onaylandı, indirim oranı değiştirilemez"
          : "İndirimi düzenle"
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
          cursor: visit.approvedDate ? "default" : "pointer",
          color: visit.approvedDate ? "#22A069" : "inherit",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: visit.approvedDate ? "inherit" : "#f5f5f5",
          },
        }}
      >
        <Typography variant="caption">
          İndirim: %{" "}
          {discount
            ? discount.toLocaleString("tr-TR", {
                style: "decimal",
                maximumFractionDigits: 2,
              })
            : 0}
        </Typography>
      </Grid>
    </Tooltip>
  );
}

export default VisitDiscount;
