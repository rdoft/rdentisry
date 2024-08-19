import React from "react";
import { Typography, Box } from "@mui/material";

function TimeGutter({ slotMetrics, children }) {
  return (
    <Box
      className="time-gutter"
      display="flex"
      flex="none"
      flexDirection="column"
      mt="-8px"
      sx={{
        width: "64px",
        minHeight: "100%",
      }}
    >
      {slotMetrics.groups.map(([start, end], index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          gap="1.6px"
          px="16px"
          mt={index === 0 && 1}
          mb={index === 0 && -1}
          sx={{
            minHeight: "70px",
          }}
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
