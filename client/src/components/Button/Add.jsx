import React from "react";
import BaseButton from "./BaseButton";

const Add = ({ label, onClick, ...props }) => {
  return (
    <BaseButton icon="pi pi-plus" label={label} onClick={onClick} {...props} />
  );
};

export default Add;
