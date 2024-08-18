import React from "react";
import { Typography, Box } from "@mui/material";

function TimeGutter({ slotMetrics, children }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="16px"
      mt="-8px"
      width="64px"
    >
      {slotMetrics.groups.map(([start, end], index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          gap="1.6px"
          px="16px"
          pb="32px"
          pt={0}
          mt={index === 0 && 1}
          mb={index === 0 && -1}
        >
          <Typography variant="body1" fontWeight="bold">
            {start.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
            })}
          </Typography>
          <Typography variant="caption" fontWeight="lighter">
            {start.getUTCMinutes() || "00"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default TimeGutter;
