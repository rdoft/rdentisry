import React, { useEffect, useState } from "react";
import { Avatar, Grid, Typography, Tooltip } from "@mui/material";
import { SkeletonCategory } from "components/Skeleton";
import { cacheImages } from "utils";

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

function ProcedureCategory({ category, isLabel = true }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIcons = async () => {
      await cacheImages([
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
      ]);
      setLoading(false);
    };

    loadIcons();
  }, []);

  let icon;
  let label;
  switch (category) {
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

  if (loading) {
    return <SkeletonCategory isLabel={isLabel} />;
  }
  return (
    <>
      {isLabel ? (
        <Grid container alignItems="center">
          <Grid item>
            <Avatar
              src={icon}
              sx={{ width: "2rem !important", height: "2rem !important" }}
            />
          </Grid>
          <Grid item pl={2}>
            <Typography variant="h5" fontWeight="regular">
              {label}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Tooltip title={label} placement="left">
          <Avatar
            src={icon}
            className="mr-2 p-1"
          />
        </Tooltip>
      )}
    </>
  );
}

export default ProcedureCategory;
