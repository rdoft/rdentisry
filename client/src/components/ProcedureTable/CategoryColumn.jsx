import React from "react";
import { Dropdown } from "primereact";
import { Grid, Avatar, Typography } from "@mui/material";

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
import "assets/styles/ProceedureTable/CategoryColumn.css";

// Create a component for category column that is dropdown menu and save the changes
function CategoryColumn({ procedure, categories, onSubmit }) {
  // HANDLERS -----------------------------------------------------------------
  // onChange handler and set the category of the procedure
  const handleChange = (event) => {
    const value = event.target.value;
    procedure.procedureCategory = value;
    onSubmit(procedure);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Category value template
  const categoryItemTemplate = (option) => {
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
  };

  return (
    <Dropdown
      value={procedure.procedureCategory}
      options={categories}
      optionLabel="title"
      valueTemplate={categoryItemTemplate}
      itemTemplate={categoryItemTemplate}
      onChange={handleChange}
      className="categoryDropdown w-full"
      placeholder="Kategori seçiniz..."
    />
  );
}

export default CategoryColumn;
