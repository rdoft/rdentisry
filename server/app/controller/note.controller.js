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
