import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import NotFoundText from "components/NotFoundText";
import NoteCard from "./NoteCard";
import Note from "./Note";

// assets
import "assets/styles/PatientDetail/NotesTab.css";

// services
import { NoteService } from "services";
import { is } from "date-fns/locale";

function NotesTab({ patient }) {
  const [note, setNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isEdit, setEdit] = useState(false);

  // Set the page on loading
  useEffect(() => {
    getNotes(patient.id);
  }, [patient]);

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
    try {
      if (note.id) {
        await NoteService.updateNote(note.id, note);
      } else {
        await NoteService.saveNote(note);
        toast.success("Not eklendi");
      }

      getNotes(patient.id);
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
      {notes.length === 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
          <NotFoundText text="Not bulunamadı" />
        </div>
      ) : (
        <Grid container justifyContent="space-between" mt={2}>
          <Grid item xs={4} pr={3}>
            <DataScroller
              value={notes}
              itemTemplate={noteTemplate}
              rows={10}
              emptyMessage=<div style={{ textAlign: "center" }}>
                Not bulunamadı
              </div>
            ></DataScroller>
          </Grid>
          <Grid
            item
            xs={8}
            px={3}
            sx={{ borderRadius: 2, backgroundColor: "#f5f5f5" }}
          >
            {note ? (
              <Note note={note} onClickSave={saveNote} setEdit={setEdit} />
            ) : (
              <NotFoundText text="Görüntülemek istediğiniz notu seçiniz" />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default NotesTab;
