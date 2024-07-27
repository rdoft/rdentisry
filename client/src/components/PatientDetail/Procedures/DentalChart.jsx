import React, { useEffect, useState } from "react";
import { Badge, Divider, Skeleton } from "primereact";
import { Grid, ImageList } from "@mui/material";
import { PressKeyText } from "components/Text";
import { SwitchTeeth } from "components/Button";
import StatusBadge from "./StatusBadge";

// assets
import { upTeeth, downTeeth } from "assets/images/charts";
import { childUpTeeth, childDownTeeth } from "assets/images/charts";

function DentalChart({
  procedures,
  adult,
  selectedTeeth,
  onToggleType,
  onChangeTeeth,
}) {
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
      .then(() => Promise.all(childUpTeeth.map((img) => loadImage(img.src))))
      .then(() => Promise.all(childDownTeeth.map((img) => loadImage(img.src))))
      .then(() => setLoading(false));
  }, []);

  // Get the appropriate teeth based on the state
  const upperTeeth = adult ? upTeeth : childUpTeeth;
  const lowerTeeth = adult ? downTeeth : childDownTeeth;

  //FUNCTIONS -----------------------------------------------------------------
  // Group procedures by tooth number
  const groupedProcedures = {};
  for (let procedure of procedures) {
    const tooth = procedure.toothNumber;
    if (tooth || tooth === 0) {
      if (groupedProcedures[tooth]) {
        groupedProcedures[tooth].push(procedure);
      } else {
        groupedProcedures[tooth] = [procedure];
      }
    }
  }

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
    <Grid container justifyContent="center">
      <Grid item xs={12} textAlign="center">
        {/* Information note */}
        {selectedTeeth && !selectedTeeth.includes(0) ? (
          <PressKeyText
            text="Tüm seçimleri kaldırmak için ESC tıklayın"
            keypad={"ESC"}
          />
        ) : (
          <PressKeyText text="Dişleri seçmek için üzerine tıklayın" />
        )}
      </Grid>

      {/* Up Teeth */}
      <ImageList
        cols={adult ? 16 : 10}
        gap={0}
        sx={{ width: adult ? "100%" : "62.5%" }}
      >
        {upperTeeth.map((tooth) => (
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
              <StatusBadge procedures={groupedProcedures[tooth.number]} />
            </Grid>

            {/* Teeth */}
            <Grid item xs={5} textAlign="center">
              {toothItem(tooth)}
            </Grid>
          </Grid>
        ))}
      </ImageList>

      {/* Divider */}
      <Divider align="center" style={{ margin: 0 }}>
        <SwitchTeeth
          label={adult ? "Yetişkin" : "Çocuk"}
          onClick={onToggleType}
        />
      </Divider>

      {/* Down Teeth */}
      <ImageList
        cols={adult ? 16 : 10}
        gap={0}
        sx={{ width: adult ? "100%" : "62.5%" }}
      >
        {lowerTeeth.map((tooth) => (
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
              <StatusBadge procedures={groupedProcedures[tooth.number]} />
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
