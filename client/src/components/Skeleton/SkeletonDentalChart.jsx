import React from "react";
import { Skeleton } from "primereact";
import { Grid, ImageList } from "@mui/material";
import { Divider } from "primereact";

function SkeletonDentalChart({ adult }) {
  return (
    <Grid container justifyContent="center">
      {/* Up Teeth Skeleton */}
      <ImageList
        cols={adult ? 16 : 10}
        gap={0}
        sx={{ width: adult ? "100%" : "62.5%" }}
      >
        {Array.from({ length: adult ? 16 : 10 }).map((_, index) => (
          <Grid
            key={index}
            container
            direction="column"
            alignItems="center"
            mt={8}
            mb={3}
            sx={{ opacity: 1 }}
          >
            <Grid item xs={1} mb={5}>
              <Skeleton shape="circle" size="25px" />
            </Grid>

            <Grid item xs={5} mt={3}>
              <Skeleton width="3rem" height="10rem" />
            </Grid>
          </Grid>
        ))}
      </ImageList>

      {/* Divider */}
      <Divider align="center" style={{ margin: 0 }}>
        <Skeleton width="75px" height="30px" />
      </Divider>

      {/* Down Teeth Skeleton */}
      <ImageList
        cols={adult ? 16 : 10}
        gap={0}
        sx={{ width: adult ? "100%" : "62.5%" }}
      >
        {Array.from({ length: adult ? 16 : 10 }).map((_, index) => (
          <Grid
            key={index}
            container
            direction="column"
            alignItems="center"
            mt={3}
            sx={{ opacity: 1 }}
          >
            <Grid item xs={5} mb={3}>
              <Skeleton width="3rem" height="10rem" />
            </Grid>

            <Grid item xs={1} mt={5}>
              <Skeleton shape="circle" size="25px" />
            </Grid>
          </Grid>
        ))}
      </ImageList>
    </Grid>
  );
}

export default SkeletonDentalChart;
