import React from "react";
import { Box } from "@mui/material";

function TimeGutterHeader() {
  const width = document.querySelector(".time-gutter")?.clientWidth;

  return (
    <Box
      display="flex"
      sx={{
        width: width ? `${width}px` : "54px",
      }}
    />
  );
}

export default TimeGutterHeader;
