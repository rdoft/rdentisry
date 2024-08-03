import React, { useState } from "react";
import { Grid, Typography, ClickAwayListener } from "@mui/material";
import { InputText } from "primereact";
import { Cancel } from "components/Button";

// assets
import { useTheme } from "@mui/material/styles";

function NoteTitle({ note, onSubmit, onCancel, onEdit }) {
  const theme = useTheme();

  const [title, setTitle] = useState(note.title);
  const [isEdit, setIsEdit] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
    onEdit();
  };

  // onCancel handler
  const handleCancel = () => {
    setIsEdit(false);
    setTitle(note.title);
    onCancel();
  };

  // onSubmit handler
  const handleSubmit = () => {
    setIsEdit(false);

    const _title = title?.trim();
    if (_title) {
      setTitle(_title);
      onSubmit({
        ...note,
        title: _title,
      });
    } else {
      setTitle(note.title);
      onCancel();
    }
  };

  // onKeyDown handler, save the note on Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Grid container alignItems="center">
      {isEdit ? (
        <>
          <Grid item xs={10} m={1} onKeyDown={handleKeyDown}>
            <ClickAwayListener onClickAway={handleSubmit}>
              <InputText
                id="title"
                name="title"
                value={title}
                variant="outlined"
                autoFocus={true}
                className="w-full font-bold text-2xl"
                style={{ padding: "8px", color: theme.palette.text.primary }}
                onChange={handleChange}
              />
            </ClickAwayListener>
          </Grid>
          <Grid item xs>
            <Cancel onClick={handleCancel} />
          </Grid>
        </>
      ) : (
        <Grid
          item
          xs={10}
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
              color: theme.palette.text.primary,
            }}
            onClick={handleEdit}
          >
            {title || "Başlık ekleyin..."}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default NoteTitle;
