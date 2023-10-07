import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { InputText, InputTextarea } from "primereact";

function Note({ note, onClickSave }) {
  const [title, setTitle] = useState(null);
  const [detail, setDetail] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [editDetail, setEditDetail] = useState(false);

  // Set values as desired format
  const date = new Date(note.date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Set the variables on loading
  useEffect(() => {
    setEditTitle(false);
    setEditDetail(false);
    setTitle(note.title);
    setDetail(note.detail);
  }, [note]);

  // HANDLERS -----------------------------------------------------------------
  // onEditTitle handler
  const handleEditTitle = () => {
    setEditTitle(true);
  };

  // onEditDetail handler
  const handleEditDetail = () => {
    setEditDetail(true);
  };

  const handleSaveClick = () => {
    if (editTitle) {
      note.title = title;
      setEditTitle(false);
    } else if (editDetail) {
      note.detail = detail;
      setEditDetail(false);
    } else {
      return;
    }
    onClickSave(note);
  };

  // onCancel handler, discard changes to note
  const handleCancelClick = () => {
    setEditTitle(false);
    setEditDetail(false);
    setTitle(note.title);
    setDetail(note.detail);
  };

  const handleChange = (event) => {
    const value = event.target.value;

    if (editTitle) {
      setTitle(value);
    } else if (editDetail) {
      setDetail(value);
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ marginTop: "1em", marginBottom: "1em" }}
    >
      <Grid container item xs={12} justifyContent="center">
        <Typography variant="h6" fontWeight="light">{`${date}`}</Typography>
      </Grid>

      {/* Title */}
      {editTitle ? (
        <Grid item xs={12} m={1}>
          <InputText
            id="title"
            variant="outlined"
            className="w-full font-bold text-2xl"
            value={title}
            onChange={handleChange}
            style={{ padding: "8px", color: "#182A4D" }}
          />
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
            {title}
          </Typography>
        </Grid>
      )}

      {/* Detail */}
      {editDetail ? (
        <Grid item xs={12} m={1}>
          <InputTextarea
            id="detail"
            variant="outlined"
            className="w-full font-light text-sm line-height-3"
            autoResize="true"
            value={detail}
            onChange={handleChange}
            style={{ padding: "8px", color: "#182A4D" }}
          />
        </Grid>
      ) : (
        detail && (
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
              {detail.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          </Grid>
        )
      )}
    </Grid>
  );
}

export default Note;
