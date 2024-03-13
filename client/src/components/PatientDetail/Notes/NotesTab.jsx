import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { NewItem } from "components/Button";
import NotFoundText from "components/NotFoundText";
import NoteCard from "./NoteCard";
import Note from "./Note";

// assets
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
  const navigate = useNavigate();

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
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate, patient]);

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
    let notes;

    try {
      response = await NoteService.getNotes(patientId);
      notes = response.data;

      setNotes(notes);
      setCounts({
        ...counts,
        note: notes.length,
      });
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
        <Grid item xs={4} pr={3}>
          {notes.length === 0 ? (
            <NotFoundText text="Not yok" p={3} />
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
          xs={8}
          px={3}
          sx={{
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            border: "1px solid",
            borderColor: noteDialog ? "#333C5E" : "transparent",
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
