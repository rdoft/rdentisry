import React, { useState } from "react";
import { Typography, Grid } from "@mui/material";
import { ConfirmDialog } from "primereact";
import { SubscriptionController } from "components/Subscription";
import { DialogFooter } from "components/DialogFooter";
import { Delete } from "components/Button";

function DropdownDoctorItem({ option, onDelete }) {
  const [isDelete, setIsDelete] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onDelete handler
  const handleDelete = (event) => {
    event.stopPropagation();
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = async (event) => {
    event.stopPropagation();
    await onDelete(option);
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
    <Grid container alignItems="center">
      {/* Doctor icon */}
      <Grid item>
        <i
          className="mr-1 fi fi-rr-user-md-chat"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4px 8px 4px 0",
          }}
        ></i>
      </Grid>

      {/* Option info */}
      <Grid item xs={8}>
        <Typography variant="h6" fontWeight="bold" noWrap>
          Dt. {option.name} {option.surname}
        </Typography>
      </Grid>

      {/* Delete icon */}
      <Grid item xs={1}>
        {onDelete && (
          <SubscriptionController>
            <Delete size="small" onClick={handleDelete} />
          </SubscriptionController>
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
