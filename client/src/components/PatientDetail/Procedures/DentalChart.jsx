import React from "react";
import { Grid, ButtonBase, ImageList, ImageListItem } from "@mui/material";
import { Badge, Divider } from "primereact";

// assets
import { upTeeth, downTeeth } from "assets/images/charts";

function DentalChart({ selectedTooth, onChangeTooth }) {
  // HANDLERS -----------------------------------------------------------------
  // onClick tooth handler
  const handleChangeTooth = (tooth) => {
    tooth === selectedTooth ? onChangeTooth(null) : onChangeTooth(tooth);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Tooth item template
  const toothItem = (tooth) => (
    <ButtonBase disableRipple={true}>
      <ImageListItem
        sx={{
          alignItems: "center",
          ...(selectedTooth && tooth.number !== selectedTooth
            ? { opacity: 0.3 }
            : {}),
        }}
      >
        {/* Image */}
        <img
          srcSet={tooth.img}
          src={tooth.img}
          alt={tooth.number}
          style={{ width: "85%" }}
        />
      </ImageListItem>
    </ButtonBase>
  );

  // Number item template
  const numberItem = (number) => (
    <Badge
      value={number}
      style={{
        width: "fit-content",
        fontSize: "1rem",
        fontWeight: "400",
        borderRadius: 20,
        backgroundColor: number === selectedTooth ? "#EF4444" : "transparent",
        color: number === selectedTooth ? "white" : "unset",
        cursor: "pointer",
      }}
    ></Badge>
  );

  // Dental chart template
  const chart = (
    <>
      {/* Up Teeth */}
      <ImageList cols={16} gap={0}>
        {upTeeth.map((tooth) => (
          <Grid
            key={tooth.number}
            container
            direction="column"
            justifyContent="space-between"
            onClick={() => handleChangeTooth(tooth.number)}
          >
            {/* Numbers */}
            <Grid item xs={1} mb={5} textAlign="center">
              {numberItem(tooth.number)}
            </Grid>

            {/* Teeth */}
            {toothItem(tooth)}
          </Grid>
        ))}
      </ImageList>

      {/* Divider */}
      <Divider className="p-3" />

      {/* Down */}
      <ImageList cols={16} gap={0}>
        {downTeeth.map((tooth) => (
          <Grid
            key={tooth.number}
            container
            direction="column"
            justifyContent="space-between"
            onClick={() => handleChangeTooth(tooth.number)}
          >
            {/* Teeth */}
            {toothItem(tooth)}

            {/* Numbers */}
            <Grid item xs={1} mt={5} textAlign="center">
              {numberItem(tooth.number)}
            </Grid>
          </Grid>
        ))}
      </ImageList>
    </>
  );

  return (
    <Grid item xs={12} p={2}>
      {chart}
    </Grid>
  );
}

export default DentalChart;
