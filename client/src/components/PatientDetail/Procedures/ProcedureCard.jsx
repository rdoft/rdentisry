import React, { useState, useEffect } from "react";
import { Tag, Divider } from "primereact";
import { Grid, Typography, Avatar, Tooltip } from "@mui/material";
import ActionGroup from "components/ActionGroup/ActionGroup";

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
  const [isComplete, setIsComplete] = useState(null);

  // Set isComplete on loading
  useEffect(() => {
    setIsComplete(procedure.isComplete);
  }, [procedure]);

  // Icons for procedure categories
  let icon;
  let label;
  switch (procedure.procedure.procedureCategory.title) {
    case "Muayene" || "Teşhis":
      icon = DiagnosisIcon;
      label = "Muayene / Teşhis";
      break;
    case "Hijyen" || "Beyazlatma":
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
    case "Kaplama" || "Protez":
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
    onDelete(procedure);
  };

  const handleChange = () => {
    procedure.isComplete = !isComplete;
    onSubmit(procedure);
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
  const price = (
    <Grid container alignItems="center" justifyContent="end">
      <Grid item pr={0.5}>
        <Typography variant="h6">₺</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5" fontWeight="light">
          {procedure.invoice.amount.toLocaleString("tr-TR", {
            style: "decimal",
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Grid>
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
  const completed = (
    <Tag
      value={isComplete ? "Tamamlandı" : "Bekleniyor"}
      style={
        isComplete
          ? { backgroundColor: "#DFFCF0", color: "#22A069", cursor: "pointer" }
          : { backgroundColor: "#E8F0FF", color: "#1E7AFC", cursor: "pointer" }
      }
      onClick={handleChange}
    />
  );

  return (
    <>
      <Grid
        container
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ minHeight: "4rem", paddingY: "0.7em" }}
        alignItems="center"
      >
        {/* Name */}
        <Grid item xs={7} pr={3}>
          {name}
        </Grid>
        {/* Category */}
        <Grid item xs={1}>
          {category}
        </Grid>
        {/* Price */}
        <Grid item xs={1}>
          {price}
        </Grid>
        {/* IsCompleted */}
        <Grid container item xs={2} justifyContent="end">
          {completed}
        </Grid>
        {isHover && (
          <Grid container item xs={1} justifyContent="end">
            {deleteButton}
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>
    </>
  );
}

export default ProcedureCard;
