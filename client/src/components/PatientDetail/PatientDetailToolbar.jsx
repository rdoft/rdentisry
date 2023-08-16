import React from "react";
import { Toolbar } from "primereact";
import { Typography, Avatar } from "@mui/material";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";
import { PhoneOutlined } from "@ant-design/icons";

function PatientDetailToolbar({ name, surname, phone }) {
  // Get Add appointment buttons
  const getPatientInfo = () => {
    return (
      <React.Fragment>
        <Avatar src={avatarPatient} />
        <div className="ml-4">
          <Typography variant="h5">{`${name} ${surname}`}</Typography>
          <Typography variant="h6">
            <PhoneOutlined /> {`${phone}`}
          </Typography>
        </div>
      </React.Fragment>
    );
  };

  return <Toolbar className="mb-4 p-2" left={getPatientInfo} />;
}

export default PatientDetailToolbar;
