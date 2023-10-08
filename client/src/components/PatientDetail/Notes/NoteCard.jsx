import React from "react";
import { Grid, Typography } from "@mui/material";
import { Divider } from "primereact";
import CardTitle from "components/cards/CardTitle";

function NoteCard({ note, onClick }) {
  // Set values as desired format
  const title = note.title;
  const detail = note.detail;
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
        sx={{ marginTop: "1em", marginBottom: "1em", cursor: "pointer" }}
        onClick={handleClick}
      >
        <Grid item>
          <CardTitle title={title} />
        </Grid>
        <Grid container item xs justifyContent="end">
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {date}
          </Typography>
        </Grid>
        <Grid item xs={12} mt={1}>
          {detail && (
            <Typography variant="body1" sx={{ fontWeight: "light" }}>
              {detail.includes("\n") || detail.split(/\n/)[0].length > 128
                ? detail.split(/\n/)[0].slice(0, 128) + " ..."
                : detail.split(/\n/)[0]}
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
