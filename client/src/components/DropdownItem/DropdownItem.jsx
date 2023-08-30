import React from "react";
import { Typography, Avatar } from "@mui/material";

// assets
import { PhoneOutlined } from "@ant-design/icons";

function DropdownItem({ option, placeholder, avatar }) {
  return option ? (
    <div className="w-full p-link flex align-items-center">
      {/* Avatar icon */}
      {avatar && (
        <Avatar alt="avatar" className="mr-2" src={avatar} shape="circle" />
      )}
      {/* Option info */}
      <div className="flex flex-column align">
        <Typography variant="h5">{`${option.name} ${option.surname}`}</Typography>
        {option.phone && (
          <Typography variant="body2">
            <PhoneOutlined /> {`${option.phone}`}
          </Typography>
        )}
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
