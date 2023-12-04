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
      <Badge
        value={badge ? badge : 0}
        className="ml-2"
        style={{
          // borderRadius: 20,
          
          backgroundColor: "#F5F5F5",
          color: "unset",
        }}
      ></Badge>
    </div>
  );
}

export default TabHeader;
