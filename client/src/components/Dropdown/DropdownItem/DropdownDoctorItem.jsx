import React, { useState } from "react";
import { Typography, Avatar, Grid } from "@mui/material";
import { ConfirmDialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { Delete } from "components/Button";

// assets
import { doctorAvatar } from "assets/images/avatars";

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
    <Grid
      container
      alignItems="center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar icon */}
      <Grid item>
        <Avatar
          alt="avatar"
          className="mr-2"
          src={doctorAvatar}
          shape="circle"
          sx={{ padding: "4px 8px 4px 0" }}
        />
      </Grid>

      {/* Option info */}
      <Grid item xs={8}>
        <Typography variant="h6" fontWeight="bold" noWrap>
          Dt. {option.name} {option.surname}
        </Typography>
      </Grid>

      {/* Delete icon */}
      <Grid item xs={1}>
        {onDelete &&
          (isHover || window.matchMedia("(hover: none)").matches) && (
            <Delete onClick={handleDelete} />
          )}
      </Grid>

      {/* Confirm delete dialog */}
      {deleteDialog}
    </Grid>
  ) : (
    // Placeholder
    <div className="flex flex-column align">
      <span>Doktor seçiniz...</span>
    </div>
  );
}

export default DropdownDoctorItem;
