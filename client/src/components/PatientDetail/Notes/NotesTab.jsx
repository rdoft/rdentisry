import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import NoteCard from "./NoteCard";
import Note from "./Note";

// assets
import "assets/styles/PatientDetail/NotesTab.css";

// services
import { NoteService } from "services";
import NotFoundText from "components/NotFoundText";

function NotesTab({ patient, noteDialog, hideDialog, getCounts }) {
  let emptyNote = {
    patient: patient,
    title: "",
    detail: "",
    date: new Date(),
  };

  const [note, setNote] = useState({ ...emptyNote });
  const [notes, setNotes] = useState([]);
  const [isEdit, setEdit] = useState(false);

  // Set the page on loading
  useEffect(() => {
    getNotes(patient.id);
  }, [patient]);

  // Set the empty not for add new note
  useEffect(() => {
    setNote({ ...emptyNote });
    hideDialog();
  }, [patient, noteDialog]);

  // Set the counts for tab header
  useEffect(() => {
    getCounts();
  }, [notes]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of the notes of the patient and set notes value
  const getNotes = async (patientId) => {
    let response;
    let notes;

    try {
      response = await NoteService.getNotes(patientId);
      notes = response.data;

      setNotes(notes);
    } catch (error) {
      toast.error(toastErrorMessage);
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
      setNote(note);
    } catch (error) {
      toast.error(toastErrorMessage);
    }
  };

  // Delete the note
  const deleteNote = async (note) => {
    try {
      if (!isEdit) {
        await NoteService.deleteNote(note.id);

        getNotes(patient.id);
        setNote({ ...emptyNote });
      }
    } catch (error) {
      toast.error(toastErrorMessage);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onSelectNote handler to set the note value
  const handleSelectNote = (note) => {
    !isEdit && setNote(note);
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
        <Grid item xs={4} pr={3}>
          <DataScroller
            value={notes}
            itemTemplate={noteTemplate}
            rows={10}
            emptyMessage={<NotFoundText text={"Not bulunamadı"} p={0} />}
          ></DataScroller>
        </Grid>
        <Grid
          item
          xs={8}
          px={3}
          sx={{ borderRadius: 2, backgroundColor: "#f5f5f5" }}
        >
          <Note
            _note={note}
            onSave={saveNote}
            setEdit={setEdit}
            onDelete={deleteNote}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default NotesTab;
