import React from "react";
import { useTheme } from "@mui/material/styles";

function SelectButton({ value, options, onChange, style = {}, ...props }) {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "inline-flex",
        background: theme.palette.background.primary,
        borderRadius: "8px",
        padding: "0.18rem",
        ...style,
      }}
    >
      {options.map((item, index) => {
        const selected = value === item.value;
        return (
          <button
            key={index}
            onClick={() => onChange(item)}
            style={{
              border: "none",
              outline: "none",
              background: selected ? theme.palette.common.white : "transparent",
              color: selected
                ? theme.palette.text.secondary
                : theme.palette.text.primary,
              opacity: selected ? 1 : 0.5,
              fontWeight: 500,
              fontSize: "0.75rem",
              padding: "0.4rem 1.4rem",
              borderRadius: "8px",
              boxShadow: selected
                ? "0 2px 8px 0 rgba(16, 30, 54, 0.1)"
                : "none",
              transition: "all 0.15s",
            }}
            {...props}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default SelectButton;
