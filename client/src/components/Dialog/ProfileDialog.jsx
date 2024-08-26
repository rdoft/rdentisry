import React, { useState } from "react";
import { Avatar } from "@mui/material";
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
    >
      {/* Avatar icon */}
      <Avatar
        alt="dentalSvg"
        src={dentalSvg}
        sx={{ width: 100, height: 100, mb: 4, mx: "auto" }}
      />
      {/* Form */}
      <div className="flex">
        <div className="field mr-2">
          <label className="font-bold">
            Ad <small className="p-error">*</small>
          </label>
          <InputText
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
    </DialogTemp>
  );
}

export default ProfileDialog;
