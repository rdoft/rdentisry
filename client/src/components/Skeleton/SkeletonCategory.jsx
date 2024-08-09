import React from "react";
import { Skeleton } from "primereact";
import { Grid } from "@mui/material";

const SkeletonCategory = ({ isLabel }) => {
  return isLabel ? (
    <Grid container alignItems="center">
      <Grid item >
        <Skeleton shape="circle" size="2rem"></Skeleton>
      </Grid>
      <Grid item xs pl={2}>
        <Skeleton width="75%" />
      </Grid>
    </Grid>
  ) : (
    <Skeleton shape="circle" size="2rem"></Skeleton>
  );
};

export default SkeletonCategory;
