import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

function CircleProgress({ completed, total, ...props }) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Box display="flex" justifyContent="center" position="relative">
      {/* Background */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={34}
        thickness={3}
        style={{
          color: props.style.bgColor,
          position: "absolute",
        }}
      />
      {/* Progress */}
      <CircularProgress
        variant="determinate"
        value={progress}
        size={34}
        thickness={5}
        style={{
          color: props.style.color,
        }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          color="textPrimary"
          style={{ display: "flex", alignItems: "center" }}
        >
          <span style={{ fontWeight: "bold", fontSize: "13px" }}>{total}</span>
          <span style={{ fontSize: "10px", margin: "0 2px" }}>/</span>
          <span style={{ fontSize: "10px" }}>{completed}</span>
        </Typography>
      </Box>
    </Box>
  );
}

export default CircleProgress;
