import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";

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
  EmptyToothIcon,
} from "assets/images/icons";

function DropdownProcedureCategoryItem({ option }) {
  // Icons for procedure categories
  let icon;
  let label;
  switch (option?.title) {
    case "Muayene":
      icon = DiagnosisIcon;
      label = "Muayene";
      break;
    case "Teşhis":
      icon = DiagnosisIcon;
      label = "Teşhis";
      break;
    case "Hijyen":
      icon = CleaningIcon;
      label = "Hijyen";
      break;
    case "Beyazlatma":
      icon = CleaningIcon;
      label = "Beyazlatma";
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
      icon = VeneerIcon;
      label = "Kaplama";
      break;
    case "Protez":
      icon = VeneerIcon;
      label = "Protez";
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
      icon = EmptyToothIcon;
      label = "Belirsiz";
      break;
  }

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar src={icon} />
      </Grid>
      <Grid item pl={2}>
        <Typography variant="h5" fontWeight="regular">
          {label}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default DropdownProcedureCategoryItem;
