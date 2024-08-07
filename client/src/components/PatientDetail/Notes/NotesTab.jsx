import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { NewItem } from "components/Button";
import { NotFoundText } from "components/Text";
import NoteCard from "./NoteCard";
import Note from "./Note";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/PatientDetail/NotesTab.css";

// services
import { NoteService } from "services";

function NotesTab({
  patient,
  noteDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
}) {
  const theme = useTheme();

  const [isEdit, setEdit] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(null);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    NoteService.getNotes(patient.id, { signal })
      .then((res) => {
        setNotes(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        error.message && toast.error(error.message);
      });

    return () => {
      controller.abort();
    };
  }, [patient]);

  // Reset note when noteDialog becomes true
  useEffect(() => {
    if (noteDialog) {
      setNote(null);
      setTimeout(() => {
        hideDialog();
      }, 1000);
    }
  }, [noteDialog, hideDialog]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of the notes of the patient and set notes value
  const getNotes = async (patientId) => {
    let response;

    try {
      response = await NoteService.getNotes(patientId);
      setNotes(response.data);
      setCounts({
        ...counts,
        note: response.data.length,
      });
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Save the note (create/update)
  const saveNote = async (note) => {
    let response;

    try {
      if (note.id) {
        await NoteService.updateNote(note.id, note);
      } else {
        response = await NoteService.saveNote(note);
        const { id, title, detail, date } = response.data;
        note = { id, patient, title, detail, date };
      }

      getNotes(patient.id);
      hideDialog();
      setNote(note);
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Delete the note
  const deleteNote = async (note) => {
    try {
      if (!isEdit) {
        await NoteService.deleteNote(note.id);

        getNotes(patient.id);
        hideDialog();
        setNote(null);
      }
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onSelectNote handler to set the note value
  const handleSelectNote = (note) => {
    if (!isEdit) {
      hideDialog();
      setNote(note);
    }
  };

  // TEMPLATES ----------------------------------------------------------------
  const noteTemplate = (note) => {
    if (!note) {
      return;
    }

    return <NoteCard note={note} onClick={handleSelectNote} />;
  };

  return (
    <>
      <Grid container justifyContent="space-between" mt={2}>
        {/* Note list */}
        <Grid
          item
          xs={4}
          px={1}
          py={3}
          sx={{ borderRadius: 2, backgroundColor: theme.palette.common.white }}
        >
          {notes.length === 0 ? (
            <NotFoundText
              text="Not yok"
              style={{ backgroundColor: theme.palette.background.primary }}
            />
          ) : (
            <DataScroller
              value={notes}
              itemTemplate={noteTemplate}
              rows={10}
            ></DataScroller>
          )}

          {/* Add note */}
          <NewItem label="Not Ekle" onClick={showDialog} />
        </Grid>

        {/* Note detail */}
        <Grid
          item
          xs={7.8}
          px={3}
          sx={{
            borderRadius: 2,
            backgroundColor: theme.palette.background.primary,
            border: "1px solid",
            borderColor: noteDialog
              ? theme.palette.text.primary
              : "transparent",
          }}
        >
          <Note
            key={note?.id}
            initNote={note ? note : { patient }}
            onSubmit={saveNote}
            setEdit={setEdit}
            onDelete={deleteNote}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default NotesTab;
