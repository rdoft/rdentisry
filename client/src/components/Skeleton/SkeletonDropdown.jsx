import React from "react";
import { Skeleton } from "primereact";
import { Grid } from "@mui/material";

const SkeletonDropdown = () => {
  return (
    <Grid container alignItems="center">
      <Grid item sx={{ padding: "4px 8px 4px 0" }}>
        <Skeleton
          shape="circle"
          size="2rem"
        ></Skeleton>
      </Grid>
      <Grid item pl={2}>
        <Skeleton width="4rem" />
      </Grid>
    </Grid>
  );
};

export default SkeletonDropdown;
