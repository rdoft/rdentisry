import React from "react";
import { Typography, Avatar } from "@mui/material";

// assets
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";

function DropdownDoctorItem({ option, placeholder }) {
  return option ? (
    <div className="w-full p-link flex align-items-center">
      {/* Avatar icon */}
      <Avatar
        alt="avatar"
        className="mr-2 p-1"
        src={avatarDoctor}
        shape="circle"
      />

      {/* Option info */}
      <div className="flex flex-column align">
        <Typography variant="h5">
          Dt. {option.name} {option.surname}
        </Typography>
      </div>
    </div>
  ) : (
    // Placeholder
    <div className="flex flex-column align">
      <span>Doktor seçiniz...</span>
    </div>
  );
}

export default DropdownDoctorItem;
