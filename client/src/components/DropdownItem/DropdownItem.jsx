import React from "react";
import { Avatar } from "primereact";

function DropdownItem({ option, placeholder, avatar }) {
  return option ? (
    <div className="w-full p-link flex align-items-center">
      {/* Avatar icon */}
      {avatar && (
        <Avatar alt="avatar" className="mr-2" image={avatar} shape="circle" />
      )}
      {/* Option info */}
      <div className="flex flex-column align">
        <span className="font-bold">{option.name + " " + option.surname}</span>
        <span className="text-sm">{option.idNumber}</span>
      </div>
    </div>
  ) : (
    // Placeholder 
    <div className="flex flex-column align">
      <span>{placeholder}</span>
    </div>
  );
}

export default DropdownItem;
