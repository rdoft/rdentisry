import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputNumber } from "primereact";
import { Cancel } from "components/Button";
import { LoadingIcon } from "components/Other";

// assets
import { useTheme } from "@mui/material/styles";

function VisitDiscount({ visit, onSubmit }) {
  const theme = useTheme();

  const prevDiscount = useRef(visit.discount);
  const [discount, setDiscount] = useState(visit.discount);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const handleSave = async () => {
    prevDiscount.current = discount;
    setIsEdit(false);
    setLoading(true);
    await onSubmit(discount);
    setLoading(false);
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
          ? "Seans onaylandı, indirim oranı değiştirilemez"
          : "İndirimi düzenle"
      }
      placement="bottom-start"
      enterDelay={500}
    >
      <Grid container alignItems="center" mb={1}>
        <Grid
          container
          item
          onClick={!visit.approvedDate ? handleEdit : undefined}
          justifyContent="end"
          alignItems="center"
          xs={10}
          p={1}
          m={-1}
          sx={{
            cursor: visit.approvedDate ? "default" : "pointer",
            color: visit.approvedDate ? theme.palette.text.success : "inherit",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: visit.approvedDate
                ? "inherit"
                : theme.palette.background.primary,
            },
          }}
        >
          {visit.approvedDate && (
            <i
              className="pi pi-check-circle"
              style={{
                color: theme.palette.text.success,
                marginRight: "5px",
                fontSize: "0.7rem",
              }}
            ></i>
          )}
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
        {loading && (
          <Grid item xs={2}>
            <LoadingIcon />
          </Grid>
        )}
      </Grid>
    </Tooltip>
  );
}

export default VisitDiscount;
