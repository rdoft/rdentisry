import React from "react";
import { Badge } from "primereact";
import { Typography } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function TabHeader({ label, badge, isActive, onClick }) {
  const theme = useTheme();

  return (
    <div
      className="flex align-items-center px-4"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <h4>
        <Typography
          mr={1}
          sx={{
            opacity: isActive ? 1 : 0.5,
            color: isActive
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
          }}
        >
          {label}
        </Typography>
      </h4>

      {/* Badges */}
      {badge >= 0 && (
        <Badge
          value={badge}
          className="ml-1"
          style={{
            backgroundColor: isActive
              ? theme.palette.text.secondary
              : theme.palette.background.primary,
            color: isActive
              ? theme.palette.common.white
              : theme.palette.text.primary,
            fontSize: "0.75rem",
            fontWeight: "600",
            minWidth: "1.3rem",
            height: "1rem",
            lineHeight: "1rem",
            borderRadius: "0.7rem",
          }}
        ></Badge>
      )}
    </div>
  );
}

export default TabHeader;
