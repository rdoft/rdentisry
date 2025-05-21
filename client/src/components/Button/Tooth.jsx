import React, { useState } from "react";
import { Chip } from "primereact";
import { Cancel } from "components/Button";

// assets
import toothSvg from "assets/svg/tooth/tooth.svg";
import { useTheme, useMediaQuery } from "@mui/material";

function Tooth({ number, removable, onClick, onRemove, ...props }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isHover, setIsHover] = useState(false);

  // TEMPLATES ---------------------------------------------------------
  const template = (
    <>
      <img
        src={toothSvg}
        alt="tooth"
        style={{
          width: isMobile ? "24px" : "18px",
          height: isMobile ? "24px" : "18px",
          marginRight: isMobile ? "0.2rem" : "0.1rem",
        }}
      />
      <span
        style={{
          color: theme.palette.text.secondary,
          fontSize: isMobile ? "medium" : "small",
          fontWeight: "bold",
          paddingRight: isMobile ? "0.8rem" : "0.6rem",
        }}
      >
        {number ? number : "Genel"}
      </span>
      {removable && (
        <Cancel
          onClick={onRemove}
          severity="primary"
          size="xsmall"
          style={{
            padding: isMobile ? "0.2rem" : "0.1rem",
            minWidth: isMobile ? "1.4rem" : "1rem",
            height: isMobile ? "1.4rem" : "1rem",
          }}
        />
      )}
    </>
  );

  return (
    <Chip
      template={template}
      onClick={onClick && onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        backgroundColor:
          onClick && isHover && number
            ? "var(--palette-background-secondary)"
            : "transparent",
        border: "1px solid var(--palette-text-secondary)",
        borderRadius: "0.5rem",
        margin: isMobile ? "0.4rem" : "0.3rem",
        paddingRight: 0,
        paddingLeft: isMobile ? "1.2rem" : "1rem",
        cursor: onClick && number ? "pointer" : "default",
        ...props.style,
      }}
    />
  );
}

export default Tooth;
