const log = require("../config/log.config");
const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Token = db.token;
const Patient = db.patient;
const Appointment = db.appointment;

const { send } = require("./sms.util");
const { setSMSLimit } = require("./subscription.util");
const crypto = require("crypto");

const { HOSTNAME, HOST_SERVER } = process.env;
const HOST = HOSTNAME || HOST_SERVER || "localhost:3000";
// Define the reminder link expiration time in milliseconds
const LINK_EXPIRATION_TIME = 172800000 // 2 gün

/**
 * Send reminder for given appointment
 * @param {Appointment} appointment - The appointment to send the reminder for.
 */
async function sendAppointmentReminder(appointment) {
  let patient;
  let user;
  let client;
  let fullName;
  let time;
  let date;
  let link;
  let message;
  let success;

  try {
    patient = appointment.patient;
    user = patient.user;

    // Prepare the message
    fullName = `${patient.name} ${patient.surname}`.toLocaleUpperCase("TR");
    fullName =
      fullName.length > 30 ? fullName.substring(0, 30) + "..." : fullName;
    time = new Date(`1970-01-01T${appointment.startTime}Z`).toLocaleTimeString(
      "tr-TR",
      {
        timeZone: "Europe/Istanbul",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    date = new Date(appointment.date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    client = user.name
      ? user.name.toLocaleUpperCase("TR").length > 30
        ? user.name.toLocaleUpperCase("TR").substring(0, 30) + "..."
        : user.name.toLocaleUpperCase("TR")
      : null;

    // Create message with approval link or not based on the reminder status
    // Send appointment reminder
    if (appointment.reminderStatus === "approved") {
      message = createAppointmentMessage(fullName, date, time, client);
      success = await send(patient.phone, message);
    } else {
      link = await createApprovalLink(user.id, appointment.id);
      message = createAppointmentMessage(fullName, date, time, client, link);
      success = await send(patient.phone, message);
      if (success) {
        await Appointment.update(
          { ReminderStatus: "sent" },
          { where: { AppointmentId: appointment.id } }
        );
      }
    }
    // Decrease the SMS limit if the message was sent successfully
    if (success) {
      await sequelize.transaction(async (t) => {
        await setSMSLimit(user.id, -1, t);
      });
    }

    return success;
  } catch (error) {
    log.error.error(error);
    throw new Error(error);
  }
}

/**
 * Send reminder for given payment
 * @param {Patient} patient - The payment to send the reminder for.
 */
async function sendPaymentReminder(patient) {
  let client;
  let fullName;
  let message;
  let success;

  try {
    // Prepare the message
    fullName = `${patient.name} ${patient.surname}`.toLocaleUpperCase("TR");
    fullName =
      fullName.length > 30 ? fullName.substring(0, 30) + "..." : fullName;
    client = patient.user.name
      ? patient.user.name.toLocaleUpperCase("TR").length > 30
        ? patient.user.name.toLocaleUpperCase("TR").substring(0, 30) + "..."
        : patient.user.name.toLocaleUpperCase("TR")
      : null;

    // Create message
    message = createPaymentMessage(fullName, client, patient.dept);

    // Send payment reminder & decrease the SMS limit
    success = await send(patient.phone, message);
    if (success) {
      await sequelize.transaction(async (t) => {
        await setSMSLimit(patient.user.id, -1, t);
      });
    }

    return success;
  } catch (error) {
    log.error.error(error);
    throw new Error(error);
  }
}

/**
 * Create message for appointment reminder
 * @param {String} fullName - The full name of the patient.
 * @param {String} date - The date and time of the appointment.
 * @param {String} client - The name of the user.
 * @param {String} url - The approval link for the appointment.
 * @returns {String} - The reminder message.
 */
function createAppointmentMessage(fullName, date, time, client, url) {
  if (url) {
    return (
      `Sn. ${fullName},\\n${date} ${time} tarihindeki diş hekimi randevunuza katılım durumunuzu bildiriniz.` +
      `\\n\\nOnay, İptal veya Değişiklik için:\\n${url} \\n` +
      (client ? `\\n${client}` : "") +
      `\\nSaygılarımızla.`
    );
  } else {
    return (
      `Sn. ${fullName},\\n${date} ${time} tarihindeki diş hekimi randevunuzu hatırlatırız.\\n` +
      (client ? `\\n${client}` : "") +
      `\\nSaygılarımızla.`
    );
  }
}

/**
 * Create message for payment reminder
 * @param {String} fullName - The full name of the patient.
 * @param {String} client - The name of the user.
 * @param {Number} dept - The total amount of debt.
 * @returns {String} - The reminder message.
 */
function createPaymentMessage(fullName, client, dept) {
  if (dept > 0) {
    return (
      `Sn. ${fullName},\\nDiş tedavinizden kalan ${dept} TL tutarında bir ödemeniz bulunmaktadır. En kısa sürede ödeme yapmanızı rica ederiz.\\n` +
      (client ? `\\n${client}` : "") +
      `\\nSaygılarımızla.`
    );
  } else {
    return (
      `Sn. ${fullName},\\nDiş tedavinizle ilgili tarihi geçmiş bir ödemeniz bulunmaktadır. Ödemenizi en kısa sürede yapmanızı rica ederiz.\\n` +
      (client ? `\\n${client}` : "") +
      `\\nSaygılarımızla.`
    );
  }
}

/**
 * Create url for appointment approval
 * @param {String} userId - The id of the user.
 * @param {String} appointmentId - The id of the appointment.
 */
async function createApprovalLink(userId, appointmentId) {
  try {
    const token = crypto.randomBytes(32).toString("hex") + ":" + appointmentId;

    // Upsert the token for the user (userId - appointmentId pair)
    const existingToken = await Token.findOne({
      where: {
        UserId: userId,
        Type: "reminder",
        Token: {
          [Sequelize.Op.endsWith]: `:${appointmentId}`,
        },
      },
    });
    if (existingToken) {
      await existingToken.update({
        Token: token,
        Expiration: new Date(Date.now() + LINK_EXPIRATION_TIME),
      });
    } else {
      await Token.create({
        UserId: userId,
        Token: token,
        Expiration: new Date(Date.now() + LINK_EXPIRATION_TIME),
        Type: "reminder",
      });
    }

    return `https://${HOST}/confirm/${token}`;
  } catch (error) {
    log.error.error(error);
    throw new Error(error);
  }
}

module.exports = {
  sendAppointmentReminder,
  sendPaymentReminder,
  createAppointmentMessage,
  createPaymentMessage,
  createApprovalLink,
};
