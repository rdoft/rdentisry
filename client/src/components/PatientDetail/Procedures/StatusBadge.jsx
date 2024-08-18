import React from "react";
import { Image } from "primereact";
import { Grid, Box, Typography, Tooltip } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";
import { CompletedIcon, InProgressIcon } from "assets/images/icons";

function StatusBadge({ procedures }) {
  const theme = useTheme();

  let inProgress = null;
  let completed = null;
  const inProgressTooltip = [];
  const completedTooltip = [];

  if (procedures) {
    inProgress = procedures.find((procedure) => !procedure.completedDate);
    completed = procedures.find((procedure) => procedure.completedDate);

    procedures.forEach((procedure, index) => {
      const tooltip = (
        <Box key={index} mb={1}>
          <Typography variant="body2" color={theme.palette.text.primary}>
            <strong>{procedure.procedure.name}</strong> -{" "}
            {procedure.visit.title}
          </Typography>
        </Box>
      );

      if (procedure.completedDate) {
        completedTooltip.push(tooltip);
      } else {
        inProgressTooltip.push(tooltip);
      }
    });
  }

  return (
    <>
      <Tooltip
        title={completedTooltip}
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.background.primary,
              color: theme.palette.text.primary,
              visibility: completed ? "visible" : "hidden",
            },
          },
        }}
      >
        <Grid container item justifyContent="center">
          <Image
            src={CompletedIcon}
            width="15px"
            style={{ visibility: completed ? "visible" : "hidden" }}
          />
        </Grid>
      </Tooltip>
      <Tooltip
        title={inProgressTooltip}
        placement="bottom"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.background.primary,
              color: theme.palette.text.primary,
              visibility: inProgress ? "visible" : "hidden",
            },
          },
        }}
      >
        <Grid container item justifyContent="center">
          <Image
            src={InProgressIcon}
            width="15px"
            style={{
              visibility: inProgress ? "visible" : "hidden",
            }}
          />
        </Grid>
      </Tooltip>
    </>
  );
}

export default StatusBadge;
