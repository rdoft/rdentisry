import React, { useEffect, useState } from "react";
import { Badge, Divider, Skeleton } from "primereact";
import { Grid, ImageList } from "@mui/material";
import StatusBadge from "./StatusBadge";

// assets
import { upTeeth, downTeeth } from "assets/images/charts";

function DentalChart({ procedures, selectedTeeth, onChangeTeeth }) {
  const [loading, setLoading] = useState(true);

  // Load image on mount
  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    };

    Promise.all(upTeeth.map((img) => loadImage(img.src)))
      .then(() => Promise.all(downTeeth.map((img) => loadImage(img.src))))
      .then(() => setLoading(false));
  }, []);

  // HANDLERS -----------------------------------------------------------------
  // onClick tooth handler
  const handleSelectTooth = (tooth) => {
    selectedTeeth.includes(tooth)
      ? onChangeTeeth(selectedTeeth.filter((number) => number !== tooth))
      : onChangeTeeth([...selectedTeeth, tooth]);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Tooth item template
  const toothItem = (tooth) => (
    <>
      {loading && <Skeleton width="65%" height="8vw"></Skeleton>}
      <img
        visiblity={loading ? "hidden" : "visible"}
        srcSet={tooth.src}
        src={tooth.src}
        alt={tooth.number}
        style={{ width: "65%", minWidth: 45 }}
      />
    </>
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

  return (
    <>
      {/* Up Teeth */}
      <ImageList cols={16} gap={0}>
        {upTeeth.map((tooth) => (
          <Grid
            key={tooth.number}
            container
            direction="column"
            onClick={() => handleSelectTooth(tooth.number)}
            pt={3}
            sx={{
              opacity:
                selectedTeeth.includes(0) ||
                selectedTeeth.includes(tooth.number)
                  ? 1
                  : 0.3,
            }}
          >
            {/* Numbers */}
            <Grid item xs={1} pb={1} textAlign="center">
              {numberItem(tooth.number)}
            </Grid>

            {/* Status */}
            <Grid container item xs={1}>
              <StatusBadge procedures={procedures[tooth.number]} />
            </Grid>

            {/* Teeth */}
            <Grid item xs={5} textAlign="center">
              {toothItem(tooth)}
            </Grid>
          </Grid>
        ))}
      </ImageList>

      {/* Divider */}
      <Divider />

      {/* Down Teeth */}
      <ImageList cols={16} gap={0}>
        {downTeeth.map((tooth) => (
          <Grid
            key={tooth.number}
            container
            direction="column"
            onClick={() => handleSelectTooth(tooth.number)}
            sx={{
              opacity:
                selectedTeeth.includes(0) ||
                selectedTeeth.includes(tooth.number)
                  ? 1
                  : 0.3,
            }}
          >
            {/* Teeth */}
            <Grid item xs={5} textAlign="center">
              {toothItem(tooth)}
            </Grid>

            {/* Status */}
            <Grid container item xs={1} direction="column-reverse">
              <StatusBadge procedures={procedures[tooth.number]} />
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
}

export default DentalChart;
