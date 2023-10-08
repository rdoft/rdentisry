import React, { useState, useEffect } from "react";
import { Grid, Typography, ClickAwayListener } from "@mui/material";
import { InputText, InputTextarea } from "primereact";
import ActionGroup from "components/ActionGroup/ActionGroup";

function Note({ _note, onSave, setEdit, onDelete }) {
  const [note, setNote] = useState({ ..._note });
  const [prevNote, setPrevNote] = useState({ ..._note });
  const [editTitle, setEditTitle] = useState(false);
  const [editDetail, setEditDetail] = useState(false);

  // Set values as desired format
  const date = new Date(note.date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Set the note on loading
  useEffect(() => {
    setNote({ ..._note });
    setPrevNote({ ..._note });
  }, [_note]);

  // Set the variables on loading
  // useEffect(() => {
  //   setEditTitle(false);
  //   setEditDetail(false);
  // }, [note]);

  // HANDLERS -----------------------------------------------------------------
  // onEditTitle handler
  const handleEditTitle = () => {
    setPrevNote(note);
    setEditTitle(true);
    setEdit(true);
  };

  // onEditDetail handler
  const handleEditDetail = () => {
    setPrevNote(note);
    setEditDetail(true);
    setEdit(true);
  };

  // onSave handler, to save changes
  const handleSaveClick = () => {
    let _note = { ...note };

    if (editTitle) {
      _note.title = note.title.trim();
      setEditTitle(false);
    } else if (editDetail) {
      _note.detail = note.detail?.trim();
      setEditDetail(false);
    } else {
      return;
    }

    setEdit(false);
    setNote(_note);
    onSave(note);
  };

  // onCancel handler, discard changes to note
  const handleCancelClick = () => {
    setNote(prevNote);
    setEditTitle(false);
    setEditDetail(false);
    setEdit(false);
  };

  // onDelete handler
  const handleDelete = () => {
    onDelete(note);
  };

  // onChange handler, update the title and detail
  const handleChange = (event) => {
    const value = event.target.value;
    let _note = { ...note };

    if (editTitle) {
      _note.title = value;
    } else if (editDetail) {
      _note.detail = value;
    }
    setNote(_note);
  };

  // onKeyDown handler, save the note on Ctrl+Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey === true) {
      handleSaveClick();
    } else if (event.key === "Escape") {
      handleCancelClick();
    }
  };

  // handleClickAway handler, save the note on click away
  const handleClickAway = () => {
    note.title?.trim() ? handleSaveClick() : handleCancelClick();
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ marginTop: "1em", marginBottom: "1em" }}
      onKeyDown={handleKeyDown}
    >
      <Grid container item xs={12} alignItems="center">
        <Grid container item xs={11} p={1.2} justifyContent="center">
          <Typography variant="h6" fontWeight="light">{`${date}`}</Typography>
        </Grid>
        <Grid container item xs={1} justifyContent="end">
          {note.id && <ActionGroup onClickDelete={handleDelete} />}
        </Grid>
      </Grid>

      {/* Title */}
      {editTitle ? (
        <Grid item xs={12} m={1}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <InputText
              id="title"
              variant="outlined"
              autoFocus={true}
              className="w-full font-bold text-2xl"
              style={{ padding: "8px", color: "#182A4D" }}
              value={note.title}
              onChange={handleChange}
            />
          </ClickAwayListener>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          m={1}
          p={1}
          sx={{
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bolder",
              color: "#182A4D",
            }}
            onClick={handleEditTitle}
          >
            {note.title || "Başlık ekleyin..."}
          </Typography>
        </Grid>
      )}

      {/* Detail */}
      {editDetail ? (
        <Grid item xs={12} m={1}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <InputTextarea
              id="detail"
              variant="outlined"
              autoResize="true"
              autoFocus={true}
              className="w-full font-light text-sm line-height-3"
              style={{ padding: "8px", color: "#182A4D" }}
              value={note.detail}
              onChange={handleChange}
            />
          </ClickAwayListener>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          m={1}
          p={1}
          sx={{
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <Typography
            component="div"
            variant="body1"
            sx={{ fontWeight: "light" }}
            onClick={handleEditDetail}
          >
            {note.detail
              ? note.detail.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "Detay ekleyin..."}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default Note;
