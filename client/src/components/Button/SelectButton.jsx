import React from "react";
import Basic from "./Basic";

function SelectButton({ value, options, onChange, ...props }) {
  return options.map((item, index) => (
    <Basic
      key={index}
      label={item.label}
      onClick={() => onChange(item)}
      style={{
        color: value === item.value ? "#F5F5F5" : "#182A4C",
        backgroundColor: value === item.value ? "#182A4C" : "#F5F5F5",
        marginRight: "0.5rem",
        ...props.style,
      }}
    />
  ));
}

export default SelectButton;
