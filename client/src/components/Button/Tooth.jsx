import React, { useState } from "react";
import { Chip } from "primereact";
import { Cancel } from "components/Button";

// assets
import toothSvg from "assets/svg/tooth/tooth.svg";
import { useTheme } from "@mui/material/styles";

function Tooth({ number, removable, onClick, onRemove, ...props }) {
  const theme = useTheme();
  const [isHover, setIsHover] = useState(false);

  // TEMPLATES ---------------------------------------------------------
  const template = (
    <>
      <img
        src={toothSvg}
        alt="tooth"
        style={{ width: "18px", height: "18px", marginRight: "0.1rem" }}
      />
      <span
        style={{
          color: theme.palette.text.secondary,
          fontSize: "small",
          fontWeight: "bold",
          paddingRight: "0.6rem",
        }}
      >
        {number ? number : "Genel"}
      </span>
      {removable && (
        <Cancel
          onClick={onRemove}
          style={{
            color: theme.palette.text.secondary,
            width: "18px",
            height: "18px",
            paddingLeft: "0.5rem",
            paddingRight: "0.6rem",
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
        margin: "0.3rem",
        paddingRight: 0,
        paddingLeft: "1rem",
        cursor: onClick && number ? "pointer" : "default",
        ...props.style,
      }}
    />
  );
}

export default Tooth;
