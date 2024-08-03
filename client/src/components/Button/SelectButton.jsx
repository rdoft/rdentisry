import React from "react";
import Basic from "./Basic";

// assets
import { useTheme } from "@mui/material/styles";

function SelectButton({ value, options, onChange, ...props }) {
  const theme = useTheme();

  return options.map((item, index) => (
    <Basic
      key={index}
      label={item.label}
      onClick={() => onChange(item)}
      style={{
        color:
          value === item.value
            ? theme.palette.common.white
            : theme.palette.text.primary,
        backgroundColor:
          value === item.value
            ? theme.palette.text.secondary
            : theme.palette.background.primary,
        marginRight: "0.5rem",
        ...props.style,
      }}
    />
  ));
}

export default SelectButton;
