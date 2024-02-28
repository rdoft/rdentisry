import React from "react";
import { Badge } from "primereact";
import { Typography } from "@mui/material";

function TabHeader({ label, badge, isActive, onClick }) {
  return (
    <div
      className="flex align-items-center px-3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <h4>
        <Typography
          sx={{
            fontWeight: "light",
            color: isActive && "primary.main",
          }}
        >
          {label}
        </Typography>
      </h4>
      <Badge
        value={badge ? badge : 0}
        className="ml-2"
        style={{
          backgroundColor: "#F5F5F5",
          color: "unset",
        }}
      ></Badge>
    </div>
  );
}

export default TabHeader;
