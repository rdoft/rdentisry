import React, { useEffect, useState } from "react";
import { Badge, Divider, Skeleton } from "primereact";
import { Grid, ImageList } from "@mui/material";
import StatusBadge from "./StatusBadge";

// assets
import { upTeeth, downTeeth } from "assets/images/charts";

function DentalChart({ procedures, selectedTooth, onChangeTooth }) {
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
  const handleChangeTooth = (tooth) => {
    tooth === selectedTooth ? onChangeTooth(null) : onChangeTooth(tooth);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Tooth item template
  const toothItem = (tooth) =>
    loading ? (
      <Skeleton width="85%" height="8vw"></Skeleton>
    ) : (
      <img
        srcSet={tooth.src}
        src={tooth.src}
        alt={tooth.number}
        style={{ width: "85%" }}
      />
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
    <Grid item xs={12} p={2}>
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
              <StatusBadge procedures={procedures[tooth.number]} />
            </Grid>

            {/* Teeth */}
            <Grid item>{toothItem(tooth)}</Grid>
          </Grid>
        ))}
      </ImageList>

      {/* Divider */}
      <Divider className="p-3" />

      {/* Down Teeth */}
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
              <StatusBadge procedures={procedures[tooth.number]} />
            </Grid>

            {/* Numbers */}
            <Grid item xs={1} pt={1} textAlign="center">
              {numberItem(tooth.number)}
            </Grid>
          </Grid>
        ))}
      </ImageList>
    </Grid>
  );
}

export default DentalChart;
