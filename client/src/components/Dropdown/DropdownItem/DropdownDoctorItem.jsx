import React, { useState } from "react";
import { Typography, Avatar } from "@mui/material";
import { ConfirmDialog } from "primereact";

// assets
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";
import ActionGroup from "components/ActionGroup/ActionGroup";
import DialogFooter from "components/DialogFooter/DialogFooter";

function DropdownDoctorItem({ option, onDelete }) {
  const [isHover, setIsHover] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onMouseEnter handler for display buttons
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  // onMouseLeave handler for hide buttons
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // onDelete handler
  const handleDelete = (event) => {
    event.stopPropagation();
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = () => {
    onDelete(option);
    setIsDelete(false);
  };

  // onHideDelete handler
  const handleDeleteHide = () => {
    setIsDelete(false);
  };

  // Delete confirm dialog
  const deleteDialog = (
    <ConfirmDialog
      visible={isDelete}
      onHide={handleDeleteHide}
      message=<Typography variant="body1">
        <strong>
          Dt. {option?.name} {option?.surname}
        </strong>{" "}
        silmek istediğinize emin misiniz?
      </Typography>
      header="Doktor Sil"
      footer=<DialogFooter
        onHide={handleDeleteHide}
        onDelete={handleDeleteConfirm}
      />
    />
  );

  return option ? (
    <>
      <div
        className="w-full p-link flex align-items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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

        {/* Delete icon */}
        {onDelete &&
          (isHover || window.matchMedia("(hover: none)").matches) && (
            <ActionGroup onClickDelete={handleDelete} />
          )}
        {/* Confirm delete dialog */}
        {deleteDialog}
      </div>
    </>
  ) : (
    // Placeholder
    <div className="flex flex-column align">
      <span>Doktor seçiniz...</span>
    </div>
  );
}

export default DropdownDoctorItem;
