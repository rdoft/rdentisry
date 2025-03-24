import React, { useState } from "react";
import { Avatar, Box } from "@mui/material";
import { InputText } from "primereact";
import { DialogTemp } from "components/Dialog";

// assets
import dentalSvg from "assets/svg/profile/dental.svg";

function ProfileDialog({ initProfile = {}, onSubmit, onHide }) {
  const [profile, setProfile] = useState({
    name: "",
    ...initProfile,
  });
  const [isValid, setIsValid] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { name, value } = event.target;

    const _profile = {
      ...profile,
      [name]: value,
    };

    // validation
    const _isValid = _profile.name.trim();

    setProfile(_profile);
    setIsValid(_isValid);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(profile);
  };

  return (
    <DialogTemp
      isValid={isValid}
      onHide={handleHide}
      onSubmit={handleSubmit}
      header="Profil Düzenle"
      style={{ width: "clamp(280px, 90%, 450px)" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 1, sm: 2 },
        }}
      >
        {/* Avatar icon */}
        <Avatar
          alt="dentalSvg"
          src={dentalSvg}
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            mb: { xs: 2, sm: 4 },
            mx: "auto",
          }}
        />
        {/* Form */}
        <Box sx={{ width: "100%" }}>
          <div className="field">
            <label className="font-bold" style={{ fontSize: "1rem" }}>
              Ad <small className="p-error">*</small>
            </label>
            <InputText
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              autoComplete="off"
              style={{
                fontSize: "1rem",
                padding: "0.75rem",
                width: "100%",
                minHeight: "40px",
              }}
            />
          </div>
        </Box>
      </Box>
    </DialogTemp>
  );
}

export default ProfileDialog;
