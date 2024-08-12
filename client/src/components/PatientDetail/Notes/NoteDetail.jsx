import React, { useState } from "react";
import { Grid, Typography, ClickAwayListener } from "@mui/material";
import { InputTextarea } from "primereact";
import { Cancel } from "components/Button";

// assets
import { useTheme } from "@mui/material/styles";

function NoteDetail({ note, onSubmit, onCancel, onEdit }) {
  const theme = useTheme();

  const [detail, setDetail] = useState(note.detail);
  const [isEdit, setIsEdit] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    setDetail(event.target.value);
  };

  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
    onEdit();
  };

  // onCancel handler
  const handleCancel = () => {
    setIsEdit(false);
    setDetail(note.detail);
    onCancel();
  };

  // onSubmit handler
  const handleSubmit = () => {
    setIsEdit(false);

    if (note.title?.trim()) {
      setDetail(detail?.trim());
      onSubmit({
        ...note,
        detail: detail?.trim(),
      });
    } else {
      setDetail(note.detail);
      onCancel();
    }
  };

  // onKeyDown handler, save the note on Ctrl+Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Grid container>
      {isEdit ? (
        <>
          <Grid item xs={10} m={1} onKeyDown={handleKeyDown}>
            <ClickAwayListener onClickAway={handleSubmit}>
              <InputTextarea
                id="detail"
                name="detail"
                value={detail}
                variant="outlined"
                autoResize={true}
                autoFocus={true}
                className="w-full font-light text-sm line-height-3"
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
            component="div"
            variant="body1"
            sx={{ fontWeight: "light" }}
            onClick={handleEdit}
          >
            {detail
              ? detail.split("\n").map((line, index) => (
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

export default NoteDetail;
