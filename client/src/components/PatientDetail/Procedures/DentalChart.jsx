import React, { useEffect } from "react";
import { Badge, Divider, Image } from "primereact";
import { Grid, ButtonBase, ImageList, ImageListItem } from "@mui/material";

// assets
import { upTeeth, downTeeth } from "assets/images/charts";
import { CompletedIcon, InProgressIcon } from "assets/images/icons";

function DentalChart({ procedures, selectedTooth, onChangeTooth }) {
  // useEffect(() => {

  // }, [procedures]);

  // HANDLERS -----------------------------------------------------------------
  // onClick tooth handler
  const handleChangeTooth = (tooth) => {
    tooth === selectedTooth ? onChangeTooth(null) : onChangeTooth(tooth);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Tooth item template
  const toothItem = (tooth) => (
    <ImageListItem sx={{ alignItems: "center" }}>
      {/* Image */}
      <img
        srcSet={tooth.img}
        src={tooth.img}
        alt={tooth.number}
        style={{ width: "85%" }}
      />
    </ImageListItem>
  );

  // Number item template
  const numberItem = (number) => (
    <Badge
      value={number}
      style={{
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "400",
        borderRadius: 20,
        backgroundColor: "unset",
        color: "unset",
      }}
    ></Badge>
  );

  // Status item template
  const statusItem = (number) => {
    let inProgress;
    let completed;

    if (procedures[number]) {
      inProgress = procedures[number].find(
        (procedure) => !procedure.isComplete
      );
      completed = procedures[number].find((procedure) => procedure.isComplete);
    } else {
      inProgress = false;
      completed = false;
    }

    return (
      <>
        <Grid container item>
          <Image
            src={CompletedIcon}
            width="20%"
            style={{ visibility: completed ? "visible" : "hidden" }}
          />
        </Grid>
        <Grid container item>
          <Image
            src={InProgressIcon}
            width="20%"
            style={{
              visibility: inProgress ? "visible" : "hidden",
            }}
          />
        </Grid>
      </>
    );
  };

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
            onClick={() => handleChangeTooth(tooth.number)}
            sx={{
              opacity:
                selectedTooth && tooth.number !== selectedTooth ? 0.3 : 1,
            }}
          >
            {/* Numbers */}
            <Grid item xs={1} pb={1} textAlign="center">
              {numberItem(tooth.number)}
            </Grid>

            {/* Status */}
            <Grid container item xs={1} textAlign="center">
              {statusItem(tooth.number)}
            </Grid>

            {/* Teeth */}
            <Grid item>{toothItem(tooth)}</Grid>
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
            onClick={() => handleChangeTooth(tooth.number)}
            sx={{
              opacity:
                selectedTooth && tooth.number !== selectedTooth ? 0.3 : 1,
            }}
          >
            {/* Teeth */}
            <Grid item>{toothItem(tooth)}</Grid>

            {/* Status */}
            <Grid
              container
              item
              xs={1}
              direction="column-reverse"
              textAlign="center"
            >
              {statusItem(tooth.number)}
            </Grid>

            {/* Numbers */}
            <Grid item xs={1} pt={1} textAlign="center">
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
