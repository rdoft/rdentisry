import React from "react";
import { Chip } from "primereact";
import { Cancel } from "components/Button";

// assets
import toothSvg from "assets/svg/tooth/tooth.svg";

function Tooth({ number, removable, onRemove, ...props }) {
  const template = (
    <>
      <img
        src={toothSvg}
        alt="tooth"
        style={{ width: "18px", height: "18px", marginRight: "0.1rem" }}
      />
      <span
        style={{
          color: "#2644E1",
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
            color: "#2644E1",
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
      style={{
        backgroundColor: "transparent",
        border: "1px solid #2644E1",
        borderRadius: "0.5rem",
        margin: "0.3rem",
        paddingRight: 0,
        paddingLeft: "1rem",
        ...props.style,
      }}
    />
  );
}

export default Tooth;
