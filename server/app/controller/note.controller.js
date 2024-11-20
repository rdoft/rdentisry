const log = require("../config/log.config");
const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Note = db.note;
const Patient = db.patient;

const { setStorageLimit } = require("../utils/subscription.util");

/**
 * Get note list of the given patientId
 * @query {string} patientId id of the patient
 */
exports.getNotes = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.query;
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
    log.audit.info("Get notes completed", {
      userId,
      action: "GET",
      success: true,
      request: {
        params: req.params,
      },
      resource: {
        type: "note",
        count: notes.length,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
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
      log.audit.info("Get note completed", {
        userId,
        action: "GET",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "note",
          id: noteId,
        },
      });
    } else {
      res.status(404).send({ message: "Not mevcut değil" });
      log.audit.warn("Get note failed: Note doesn't exist", {
        userId,
        action: "GET",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "note",
          id: noteId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
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

  try {
    // Get patient and control if it belongs to the authenticated user
    const patientRecord = await Patient.findOne({
      where: {
        PatientId: patient.id,
        UserId: userId,
      },
    });

    if (!patientRecord) {
      res.status(404).send({
        message: "Not eklenmek istenen hasta mevcut değil",
      });
      log.audit.warn("Save note failed: Patient doesn't exist", {
        userId,
        action: "POST",
        success: false,
        resource: {
          type: "note",
        },
      });
      return;
    }

    // Create Note record and update the storage limit
    const note = await sequelize.transaction(async (t) => {
      const note = await Note.create(values, { transaction: t });
      await setStorageLimit(userId, "note", -1, t);
      return {
        id: note.NoteId,
        patientId: note.PatientId,
        detail: note.Detail,
        title: note.Title,
        date: note.Date,
      };
    });

    res.status(200).send(note);
    log.audit.info("Save note completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "note",
        id: note.id,
      },
    });
  } catch (error) {
    error.code
      ? res.status(error.code).send({ message: error.message })
      : res.status(500).send(error);
    log.error.error(error);
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
      res.status(404).send({
        message: "Güncellenen hasta bilgisi mevcut değil",
      });
      log.audit.warn("Update note failed: Patient doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "note",
          id: noteId,
        },
      });
      return;
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
      res.status(404).send({ message: "Not mevcut değil" });
      log.audit.warn("Update note failed: Note doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "note",
          id: noteId,
        },
      });
      return;
    }

    // Update the note
    await note.update(values);
    res.status(200).send({ id: noteId });
    log.audit.info("Update note completed", {
      userId,
      action: "PUT",
      success: true,
      request: {
        params: req.params,
      },
      resource: {
        type: "note",
        id: noteId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
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
      await sequelize.transaction(async (t) => {
        await note.destroy({ transaction: t });
        await setStorageLimit(userId, "note", 1, t);
      });

      res.status(200).send({ id: noteId });
      log.audit.info("Delete note completed", {
        userId,
        action: "DELETE",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "note",
          id: noteId,
        },
      });
    } else {
      res.status(404).send({ message: "Not mevcut değil" });
      log.audit.warn("Delete note failed: Note doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "note",
          id: noteId,
        },
      });
    }
  } catch (error) {
    error.code
      ? res.status(error.code).send({ message: error.message })
      : res.status(500).send(error);
    log.error.error(error);
  }
};
