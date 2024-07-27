import React from "react";
import { Tooth } from "components/Button";

function DropdownToothItem({ option }) {
  return option ? (
    <Tooth number={option.label} style={{ margin: "-1.5rem 0.3rem" }} />
  ) : (
    // Placeholder
    <div className="flex flex-column align">
      <span>Seç</span>
    </div>
  );
}

export default DropdownToothItem;
