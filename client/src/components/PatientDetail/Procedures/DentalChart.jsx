import React from "react";
import {
  Grid,
  Typography,
  ButtonBase,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Badge } from "primereact";

// assets
import { teeth } from "assets/images/charts";

function DentalChart({ selectedTooth, onChangeTooth }) {
  // HANDLERS -----------------------------------------------------------------
  // onClick tooth handler
  const handleChangeTooth = (tooth) => {
    tooth === selectedTooth ? onChangeTooth(null) : onChangeTooth(tooth);
  };

  // TEMPLATES ----------------------------------------------------------------
  const toothItem = (tooth) => (
    <ImageListItem
      sx={{
        width: `100%`,
        alignItems: "center",
        ...(selectedTooth && tooth.number !== selectedTooth
          ? { opacity: 0.3 }
          : {}),
      }}
    >
      {/* Image */}
      {tooth.number <= "28" && (
        <img srcSet={tooth.img} src={tooth.img} alt={tooth.number} />
      )}
      {/* Number */}
      <Badge
        value={tooth.number}
        style={{
          width: "fit-content",
          fontSize: "1rem",
          fontWeight: "300",
          marginTop: 20,
          marginBottom: 20,
          borderRadius: 15,
          backgroundColor: tooth.number === selectedTooth ? "#EF4444" : "transparent",
          color: tooth.number === selectedTooth ? "white" : "unset",
        }}
      ></Badge>

      {/* Image */}
      {tooth.number > "28" && (
        <img srcSet={tooth.img} src={tooth.img} alt={tooth.number} />
      )}
    </ImageListItem>
  );

  const chart = (
    <ImageList cols={16} gap={0} style={{ flexWrap: "nowrap" }}>
      {teeth.map((tooth) => (
        <ButtonBase
          key={tooth.number}
          disableRipple={true}
          onClick={() => handleChangeTooth(tooth.number)}
          sx={{
            width: `auto`, // Set the width to a percentage
            overflow: "hidden", // Hide overflow to prevent wrapping
          }}
        >
          {toothItem(tooth)}
        </ButtonBase>
      ))}
    </ImageList>
  );

  return (
    <Grid
      item
      xs={12}
      p={2}
      sx={{ borderRadius: 2, backgroundColor: "#FFFFFF" }}
    >
      {chart}
    </Grid>
  );
}

export default DentalChart;
