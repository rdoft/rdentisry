import React from "react";
import { Typography, Box } from "@mui/material";

function TimeGutter({ slotMetrics, children }) {
  return (
    <Box display="flex" flexDirection="column" gap={2} mt={-1}>
      {slotMetrics.groups.map(([start, end], index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="row"
          gap={0.2}
          px={2}
          pb={4}
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
