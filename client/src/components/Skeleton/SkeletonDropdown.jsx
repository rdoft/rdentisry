import React from "react";
import { Skeleton } from "primereact";
import { Grid } from "@mui/material";

const SkeletonDropdown = (props) => {
  return (
    <Grid container alignItems="center" sx={{ ...props?.style }}>
      <Grid item>
        <Skeleton
          shape="circle"
          size="1.6rem"
        ></Skeleton>
      </Grid>
      <Grid item pl={2}>
        <Skeleton width="6rem" />
      </Grid>
    </Grid>
  );
};

export default SkeletonDropdown;
