import React from "react";
import { Badge } from "primereact";

function TabHeader({ label, badge, onClick }) {
  return (
    <div
      className="flex align-items-center px-3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <h4>{label}</h4>
      {badge && <Badge value={badge} className="mx-2"></Badge>}
    </div>
  );
}

export default TabHeader;
