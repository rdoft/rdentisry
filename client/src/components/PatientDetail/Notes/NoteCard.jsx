import React from "react";
import { Grid, Typography } from "@mui/material";
import { Divider } from "primereact";
import CardTitle from "components/cards/CardTitle";

function NoteCard({ note, onClick }) {
  // Set values as desired format
  const title = note.title;
  const detail = note.detail
    ? note.detail.includes("\n") || note.detail.split(/\n/)[0].length > 128
      ? note.detail.split(/\n/)[0].slice(0, 128) + " ..."
      : note.detail.split(/\n/)[0]
    : null;
  const date = new Date(note.date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  // HANDLERS -----------------------------------------------------------------
  // onClick handler for set the note
  const handleClick = () => {
    onClick(note);
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        py={2}
        sx={{ cursor: "pointer" }}
        onClick={handleClick}
      >
        {/* Title */}
        <Grid item>
          <CardTitle title={title} />
        </Grid>

        {/* Date */}
        <Grid container item xs justifyContent="end">
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {date}
          </Typography>
        </Grid>

        {/* Detail */}
        <Grid item xs={12} mt={1}>
          {detail && (
            <Typography variant="body1" sx={{ fontWeight: "light" }}>
              {detail}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>
    </>
  );
}

export default NoteCard;
