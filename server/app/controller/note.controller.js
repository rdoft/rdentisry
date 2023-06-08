const { Sequelize } = require("../models");
const db = require("../models");
const Note = db.note;
const Patient = db.patient;

/**
 * Get note list of the given patientId
 * @param {string} patientId id of the patient
 */
exports.getNotes = async (req, res) => {
  const { patientId: patientId } = req.query;
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
 * Add a Note
 * @body Note information
 */
exports.saveNote = async (req, res) => {
  const { patient: Patient, date: Date, detail: Detail } = req.body;
  let values = {
    PatientId: Patient.id,
    Date: Date,
    Detail: Detail,
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
