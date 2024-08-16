import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { NewItem } from "components/Button";
import { NotFoundText } from "components/Text";
import { LoadingIcon } from "components/Other";
import { useLoading } from "context/LoadingProvider";
import { LoadController } from "components/Loadable";
import { SkeletonNotesTab } from "components/Skeleton";
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
  const { loading, startLoading, stopLoading } = useLoading();

  const [isEdit, setEdit] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(null);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("NotesTab");
    NoteService.getNotes(patient.id, { signal })
      .then((res) => {
        setNotes(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("NotesTab"));

    return () => {
      controller.abort();
    };
  }, [patient, startLoading, stopLoading]);

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
      startLoading("save");
      if (note.id) {
        await NoteService.updateNote(note.id, note);
      } else {
        response = await NoteService.saveNote(note);
        const { id, title, detail, date } = response.data;
        note = { id, patient, title, detail, date };
      }

      await getNotes(patient.id);
      hideDialog();
      setNote(note);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // Delete the note
  const deleteNote = async (note) => {
    try {
      if (!isEdit) {
        startLoading("delete");
        await NoteService.deleteNote(note.id);

        await getNotes(patient.id);
        hideDialog();
        setNote(null);
      }
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
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
    <LoadController name="NotesTab" skeleton={<SkeletonNotesTab />}>
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

          {loading.save && <LoadingIcon style={{ padding: "2rem" }} />}

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
    </LoadController>
  );
}

export default NotesTab;
