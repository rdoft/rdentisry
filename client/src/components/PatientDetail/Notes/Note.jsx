import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { ConfirmDialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { Delete } from "components/Button";
import { SubscriptionController } from "components/Subscription";
import NoteTitle from "./NoteTitle";
import NoteDetail from "./NoteDetail";

function Note({ initNote, onSubmit, setEdit, onDelete }) {
  const [note, setNote] = useState({
    title: "",
    detail: "",
    date: new Date(),
    ...initNote,
  });
  const [isDelete, setIsDelete] = useState(false);

  // Set values as desired format
  const date = new Date(note.date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setEdit(true);
  };

  // onSave handler, to save changes
  const handleSubmit = (note) => {
    setEdit(false);
    setNote(note);
    onSubmit(note);
  };

  // onCancel handler, discard changes to note
  const handleCancel = () => {
    setEdit(false);
  };

  // onDelete handler
  const handleDelete = () => {
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = async () => {
    await onDelete(note);
    setIsDelete(false);
  };

  // onHideDelete handler
  const handleDeleteHide = () => {
    setIsDelete(false);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Confirm delete dialog
  const deleteDialog = (
    <ConfirmDialog
      visible={isDelete}
      onHide={handleDeleteHide}
      message={
        <Typography variant="body1">
          <strong>
            {note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title}
          </strong>{" "}
          notunu silmek istediğinize emin misiniz?
        </Typography>
      }
      header="Not Sil"
      footer=<DialogFooter
        onHide={handleDeleteHide}
        onDelete={handleDeleteConfirm}
      />
    />
  );

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginTop: "1em", marginBottom: "1em" }}
      >
        <Grid container item xs={12} alignItems="center">
          {/* Date */}
          <Grid container item xs={11} p={1.2} justifyContent="center">
            <Typography variant="h6" fontWeight="light">{`${date}`}</Typography>
          </Grid>

          {/* Delete button */}
          <Grid container item xs={1} justifyContent="end">
            {note.id && (
              <SubscriptionController>
                <Delete onClick={handleDelete} />
              </SubscriptionController>
            )}
          </Grid>
        </Grid>

        {/* Title */}
        <Grid container item xs={12}>
          <NoteTitle
            note={note}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        </Grid>

        {/* Detail */}
        <Grid container item xs={12}>
          <NoteDetail
            note={note}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        </Grid>
      </Grid>
      {/* Confirm delete dialog */}
      {deleteDialog}
    </>
  );
}

export default Note;
