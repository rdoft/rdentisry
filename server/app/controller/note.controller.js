const { Sequelize } = require("../models");
const db = require("../models");
const Note = db.note;
const Patient = db.patient;

/**
 * Get note list of the given patientId
 * @param {string} patientId id of the patient
 */
exports.getNotes = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  let notes;

  try {
    // Find notes of the patient
    notes = await Note.findAll({
      attributes: [
        ["NoteId", "id"],
        ["Date", "date"],
        ["Title", "title"],
        ["Detail", "detail"],
      ],
      order: [["Date", "ASC"]],
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["IdNumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
          where: {
            UserId: userId,
            ...(patientId && { PatientId: patientId }),
          },
        },
      ],
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
  const { UserId: userId } = req.user;
  const { noteId } = req.params;
  let note;

  try {
    // Find Note record
    note = await Note.findByPk(noteId, {
      attributes: [
        ["NoteId", "id"],
        ["Date", "date"],
        ["Title", "title"],
        ["Detail", "detail"],
      ],
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["IdNumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
          where: {
            UserId: userId,
          },
        },
      ],
      raw: true,
      nest: true,
    });

    if (note) {
      res.status(200).send(note);
    } else {
      res.status(404).send({ message: "Not mevcut değil" });
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
  const { UserId: userId } = req.user;
  const { patient, detail, title } = req.body;
  let values = {
    PatientId: patient.id,
    Detail: detail,
    Title: title,
  };
  let note;

  try {
    // Get patient and control if it belongs to the authenticated user
    const patientRecord = await Patient.findOne({
      where: {
        PatientId: patient.id,
        UserId: userId,
      },
    });

    if (!patientRecord) {
      return res.status(404).send({
        message: "Not eklenmek istenen hasta mevcut değil",
      });
    }

    // Create Note record
    note = await Note.create(values);
    note = {
      id: note.NoteId,
      patientId: note.PatientId,
      detail: note.Detail,
      title: note.Title,
      date: note.Date,
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
 * Update the Note
 * @param noteId: Id of the Note
 */
exports.updateNote = async (req, res) => {
  const { UserId: userId } = req.user;
  const { noteId } = req.params;
  const { patient, detail, title } = req.body;
  let values = {
    PatientId: patient.id,
    Detail: detail,
    Title: title,
  };
  let note;
  let patientRecord;

  try {
    // Validation
    patientRecord = await Patient.findOne({
      where: {
        PatientId: patient.id,
        UserId: userId,
      },
    });
    if (!patientRecord) {
      return res.status(404).send({
        message: "Güncellenen hasta bilgisi mevcut değil",
      });
    }

    note = await Note.findOne({
      where: {
        NoteId: noteId,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
      ],
    });

    if (!note) {
      return res.status(404).send({ message: "Not mevcut değil" });
    }

    // Update the note
    await note.update(values);
    res.status(200).send({ id: noteId });
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete the Note
 * @param noteId: Id of the Note
 */
exports.deleteNote = async (req, res) => {
  const { UserId: userId } = req.user;
  const { noteId } = req.params;
  let note;

  try {
    // Find Note
    note = await Note.findOne({
      where: {
        NoteId: noteId,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
      ],
    });

    // Delete the Note if it exists
    if (note) {
      note.destroy();

      res.status(200).send({ id: noteId });
    } else {
      res.status(404).send({ message: "Not mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
