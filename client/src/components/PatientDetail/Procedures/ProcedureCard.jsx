import React, { useState, useEffect } from "react";
import { Tag, Divider, InputNumber, ConfirmDialog } from "primereact";
import {
  Grid,
  Avatar,
  Tooltip,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import ActionGroup from "components/ActionGroup/ActionGroup";
import DialogFooter from "components/DialogFooter/DialogFooter";

// assets
import {
  DiagnosisIcon,
  CleaningIcon,
  FillingIcon,
  RootCanalIcon,
  BridgeIcon,
  VeneerIcon,
  ExtractionIcon,
  ImplantIcon,
  SurgeryIcon,
} from "assets/images/icons";

function ProcedureCard({ procedure, onDelete, onSubmit }) {
  const [isHover, setIsHover] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [editAmount, setEditAmount] = useState(false);
  const [isComplete, setIsComplete] = useState(procedure.isComplete);
  const [prevAmount, setPrevAmount] = useState(procedure.invoice.amount);

  // Set isComplete on loading
  useEffect(() => {
    setIsComplete(procedure.isComplete);
    setPrevAmount(procedure.invoice.amount);
  }, [procedure]);

  // Icons for procedure categories
  let icon;
  let label;
  switch (procedure.procedure.procedureCategory.title) {
    case "Muayene":
    case "Teşhis":
      icon = DiagnosisIcon;
      label = "Muayene / Teşhis";
      break;
    case "Hijyen":
    case "Beyazlatma":
      icon = CleaningIcon;
      label = "Hijyen / Beyazlatma";
      break;
    case "Dolgu":
      icon = FillingIcon;
      label = "Dolgu";
      break;
    case "Kanal":
      icon = RootCanalIcon;
      label = "Kanal";
      break;
    case "Köprü":
      icon = BridgeIcon;
      label = "Köprü";
      break;
    case "Kaplama":
    case "Protez":
      icon = VeneerIcon;
      label = "Kaplama / Protez";
      break;
    case "Çekme":
      icon = ExtractionIcon;
      label = "Çekme";
      break;
    case "İmplant":
      icon = ImplantIcon;
      label = "İmplant";
      break;
    case "Cerrahi":
      icon = SurgeryIcon;
      label = "Cerrahi";
      break;
    default:
      icon = null;
      label = null;
      break;
  }

  // HANDLERS -----------------------------------------------------------------
  // onMouseEnter handler for display buttons
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  // onMouseLeave handler for hide buttons
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // onDelete handler
  const handleDelete = () => {
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = () => {
    onDelete(procedure);
    setIsDelete(false);
  };

  // onHideDelete handler
  const handleDeleteHide = () => {
    setIsDelete(false);
  };

  // onChangeStatus handler
  const handleChangeStatus = () => {
    procedure.isComplete = !isComplete;
    onSubmit(procedure);
  };

  // onEditAmount handler
  const handleEditAmount = () => {
    setEditAmount(true);
  };

  // onChangeAmount handler
  const handleChangeAmount = (event) => {
    const value = event.value || 0;
    procedure.invoice.amount = value;
  };

  // onSave handler, to save changes
  const handleSaveAmount = () => {
    setEditAmount(false);
    onSubmit(procedure);
  };

  // onCancel handler, discard changes to amount
  const handleCancelAmount = () => {
    procedure.invoice.amount = prevAmount;
    setEditAmount(false);
  };

  // onKeyDown handler, save the amount on Ctrl+Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSaveAmount();
    } else if (event.key === "Escape") {
      handleCancelAmount();
    }
  };

  // handleClickAway handler, save the amount
  const handleClickAway = () => {
    handleSaveAmount();
  };

  // TEMPLATES -----------------------------------------------------------------
  // Set category of the procedure
  const category = icon && (
    <Tooltip title={label} placement="left">
      <Avatar
        src={icon}
        // sx={{ width: "32px", height: "32px" }}
      />
    </Tooltip>
  );

  // Set price of procedure
  const price = editAmount ? (
    <ClickAwayListener onClickAway={handleClickAway}>
      <InputNumber
        id="amount"
        value={procedure.invoice.amount}
        mode="currency"
        min={0}
        currency="TRY"
        locale="tr-TR"
        style={{ height: "2.5rem" }}
        onValueChange={handleChangeAmount}
      />
    </ClickAwayListener>
  ) : (
    <Grid container onClick={handleEditAmount}>
      <Typography variant="h6">₺</Typography>
      <Typography variant="h5" fontWeight="light">
        {procedure.invoice.amount.toLocaleString("tr-TR", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Grid>
  );

  // Set code of procedure
  // const code = (
  //   <Typography variant="caption" fontWeight="bold">
  //     {procedure.procedure.code}
  //   </Typography>
  // );

  // Set name of procedure
  const name = (
    <Typography variant="h5" fontWeight="light">
      {procedure.procedure.name}
    </Typography>
  );

  // Set delete button
  const deleteButton = procedure.id && (
    <ActionGroup onClickDelete={handleDelete} />
  );

  // Icon for completed procedure
  const completed = !editAmount && (
    <Tag
      value={isComplete ? "Tamamlandı" : "Bekleniyor"}
      style={
        isComplete
          ? { backgroundColor: "#DFFCF0", color: "#22A069", cursor: "pointer" }
          : { backgroundColor: "#E8F0FF", color: "#1E7AFC", cursor: "pointer" }
      }
      onClick={handleChangeStatus}
    />
  );

  // Delete confirm dialog
  const deleteDialog = (
    <ConfirmDialog
      visible={isDelete}
      onHide={handleDeleteHide}
      message=<Typography variant="body1">
        <strong>
          {procedure.procedure.name.length > 40
            ? `${procedure.procedure.name.substring(0, 40)}...`
            : procedure.procedure.name}
        </strong>{" "}
        tedavisini silmek istediğinize emin misiniz?
      </Typography>
      header="Tedavi Sil"
      footer=<DialogFooter
        onHide={handleDeleteHide}
        onDelete={handleDeleteConfirm}
      />
    />
  );

  return (
    <>
      {/* Card */}
      <Grid
        container
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        sx={{ minHeight: "4rem", paddingY: "0.7em" }}
        alignItems="center"
      >
        {/* Name */}
        <Grid item xs={7} lg={7} pr={3}>
          {name}
        </Grid>
        {/* Category */}
        <Grid item lg={1} display={{ xs: "none", lg: "block" }}>
          {category}
        </Grid>
        {/* Price */}
        <Grid item xs={2} lg={1}>
          {price}
        </Grid>
        {/* IsCompleted */}
        <Grid container item xs={2} justifyContent="end">
          {completed}
        </Grid>
        {(isHover || window.matchMedia("(hover: none)").matches) && (
          <Grid container item xs={1} justifyContent="end">
            {deleteButton}
          </Grid>
        )}
      </Grid>
      {/* Divider */}
      <Grid container>
        <Grid item xs={12}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>
      {/* Confirm delete dialog */}
      {deleteDialog}
    </>
  );
}

export default ProcedureCard;
