import React from "react";
import { Badge } from "primereact";
import { Typography } from "@mui/material";

function TabHeader({ label, badge, isActive, onClick }) {
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
            fontWeight: "light",
            color: isActive && "primary.main",
          }}
        >
          {label}
        </Typography>
      </h4>

      {/* Badges */}
      {badge.other >= 0 && (
        <Badge
          value={badge.other}
          className="ml-1"
          style={{
            backgroundColor: "#F5F5F5",
            color: "#172B4D",
            fontSize: "0.75rem",
            fontWeight: "600",
            minWidth: "1.3rem",
            height: "1rem",
            lineHeight: "1rem",
            borderRadius: "0.7rem",
          }}
        ></Badge>
      )}
      {badge.pending >= 0 && (
        <Badge
          value={badge.pending}
          className="ml-1"
          style={{
            backgroundColor: "#1E7AFC",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "600",
            minWidth: "1.3rem",
            height: "1rem",
            lineHeight: "1rem",
            borderRadius: "0.7rem",
          }}
        ></Badge>
      )}
      {badge.completed >= 0 && (
        <Badge
          value={badge.completed}
          className="ml-1"
          style={{
            backgroundColor: "#F5F5F5",
            color: "#172B4D",
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
