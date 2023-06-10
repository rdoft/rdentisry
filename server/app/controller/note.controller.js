const { Sequelize } = require("../models");
const db = require("../models");
const Note = db.note;
const Patient = db.patient;

/**
 * Get note list of the given patientId
 * @param {string} patientId id of the patient
 */
exports.getNotes = async (req, res) => {
  const { patientId } = req.params;
  let notes;

  try {
    // Find notes of the patient
    notes = await Note.findAll({
      order: [["Date", "ASC"]],
      include: [
        {
          model: Patient,
          as: "Patient",
          attributes: [],
          where: patientId && {
            PatientId: patientId,
          },
        },
      ],
    });

    notes = notes.map((note) => {
      return {
        id: note.NoteId,
        patient: note.Patient,
        date: note.Date,
        detail: note.Detail,
      };
    });

    res.status(200).send(notes);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Get a Note
 * @param noteId: Id of the Note
 */
exports.getNote = async (req, res) => {
  const { noteId } = req.params;
  let note;

  try {
    // Find Note record
    note = await Note.findByPk(noteId, {
      include: [
        {
          model: Patient,
          as: "Patient",
        },
      ],
      raw: true,
      nest: true,
    });

    if (note) {
      note = {
        id: note.NoteId,
        patient: note.Patient,
        date: note.Date,
        detail: note.Detail,
      };

      res.status(200).send(note);
    } else {
      res.status(404).send({ message: "Not bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a Note
 * @body Note information
 */
exports.saveNote = async (req, res) => {
  const { patient: Patient, detail: Detail } = req.body;
  let values = {
    PatientId: Patient.id,
    Detail: Detail,
    Date: new Date(),
  };
  let note;

  try {
    // Create Note record
    note = await Note.create(values);
    note = {
      id: note.NoteId,
      patientId: note.PatientId,
      date: note.Date,
      detail: note.Detail,
    };

    res.status(200).send(note);
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      res.status(400).send({
        message: "Not eklenmek istenen hasta mevcut değil",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Delete the Note
 * @param noteId: Id of the Note
 */
exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;
  let note;

  try {
    // Find Note
    note = await Note.findByPk(noteId);

    if (note) {
      note.destroy();

      res.status(200).send({ id : note.id });
    } else {
      res.status(404).send({ message: "Not bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete all Notes of given patient
 * @param patientId: Id of the patient
 */
exports.deleteNotes = async (req, res) => {
  const { patientId } = req.params;
  let count;

  try {
    // Find Note
    count = await Note.destroy({
      where: {
        PatientId: patientId,
      }
    });
    
    res.status(200).send({ count: count });
  } catch (error) {
    res.status(500).send(error);
  }
};