import React from "react";
import { Typography } from "@mui/material";

// assets
import { PhoneOutlined } from "@ant-design/icons";

function DropdownPatientItem({ option }) {
  return option ? (
    <div className="w-full p-link flex align-items-center">
      {/* Patient icon */}
      <i
        className="mr-1 fi fi-rr-id-card-clip-alt"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "4px 8px 4px 0",
        }}
      ></i>

      {/* Option info */}
      <div className="flex flex-column align">
        <Typography variant="h6" fontWeight="bold" noWrap>
          {`${option.name} ${option.surname}`}
        </Typography>
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
      <span>Hasta Seçiniz...</span>
    </div>
  );
}

export default DropdownPatientItem;
