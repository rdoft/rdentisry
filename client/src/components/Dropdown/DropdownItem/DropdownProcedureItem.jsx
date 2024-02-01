import React from "react";
import { Typography, Avatar, Tooltip, Grid } from "@mui/material";

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

function DropdownProcedureItem({ option, isValue }) {
  if (!option) {
    return (
      // Placeholder
      <div className="flex flex-column align">
        <span>Tedavi seçiniz...</span>
      </div>
    );
  }

  // Icons for procedure categories
  let icon;
  let label;
  switch (option.procedureCategory.title) {
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
      icon = EmptyToothIcon;
      label = "Belirsiz";
      break;
  }

  // TEMPLATE -----------------------------------------------------------------
  // Set category of the procedure
  const category = icon && (
    <Tooltip title={label} placement="left">
      <Avatar
        src={icon}
        className="mr-2 p-1"
        // sx={{ width: "32px", height: "32px" }}
      />
    </Tooltip>
  );

  // Set name of procedure
  const name = <Typography variant="h5">{option.name}</Typography>;

  // Set code of procedure
  const code = <Typography variant="body2">{option.code}</Typography>;

  // Set price of procedure
  const price = (
    <Grid>
      <Typography variant="caption" fontWeight="light">
        ₺{" "}
      </Typography>
      <Typography variant="caption" fontWeight="bolder">
        {option.price.toLocaleString("tr-TR", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Grid>
  );

  return (
    <div className="w-full p-link flex align-items-center">
      {/* Avatar icon */}
      {category}
      {/* Option info */}
      <div className="flex flex-column align mr-3">
        {name}
        {code}
      </div>
      {!isValue && (
        <div className="flex flex-column align ml-auto">{price}</div>
      )}
    </div>
  );
}

export default DropdownProcedureItem;
