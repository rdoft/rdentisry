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
      <Badge severity="secondary" value={badge ? badge : 0} className="ml-2"></Badge>
    </div>
  );
}

export default TabHeader;
