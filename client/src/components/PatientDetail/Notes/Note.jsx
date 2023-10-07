import React from "react";
import { Grid, Typography } from "@mui/material";

function Note({ note }) {
  // Set values as desired format
  const title = note.title;
  const detail = note.detail;
  const date = new Date(note.date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      sx={{ marginTop: "1em", marginBottom: "1em" }}
    >
      <Grid container item xs={12} justifyContent="center">
        <Typography variant="h6" fontWeight="light">{`${date}`}</Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bolder",
            color: "#182A4D",
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
      {detail && (
          <Typography component="div" variant="body1" sx={{ fontWeight: "light" }}>
            {detail.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default Note;
