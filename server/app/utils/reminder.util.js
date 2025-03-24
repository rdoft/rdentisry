const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Token = db.token;
const Patient = db.patient;
const Appointment = db.appointment;

const { send } = require("./sms.util");
const crypto = require("crypto");

const { ENV, HOSTNAME, PORT_SSL, PORT_CLIENT } = process.env;
const HOST =
  ENV === "production"
    ? HOSTNAME
    : ENV === "development"
    ? `${HOSTNAME}:${PORT_SSL}`
    : `${HOSTNAME}:${PORT_CLIENT}`;
// Define the reminder link expiration time in milliseconds
const LINK_EXPIRATION_TIME = 172800000; // 2 gün
// Define the maximum length of the patient and client names
const MAX_PATIENT_LENGTH = 30;
const MAX_CLIENT_LENGTH = 75;

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
  let type;

  try {
    patient = appointment.patient;
    user = patient.user;

    // Prepare the message
    fullName = `${patient.name} ${patient.surname.substring(
      0,
      1
    )}`.toLocaleUpperCase("TR");
    fullName =
      fullName.length > MAX_PATIENT_LENGTH
        ? fullName.substring(0, MAX_PATIENT_LENGTH - 1) + "*"
        : fullName + "*";
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
      ? user.name.toLocaleUpperCase("TR").length > MAX_CLIENT_LENGTH
        ? user.name
            .toLocaleUpperCase("TR")
            .substring(0, MAX_CLIENT_LENGTH - 1) + "*"
        : user.name.toLocaleUpperCase("TR")
      : null;

    // Create message with approval link or not, based on the reminder status
    if (appointment.reminderStatus === "approved") {
      message = createAppointmentMessage(fullName, date, time, client);
      type = "appointmentReminder";
    } else {
      link = await createApprovalLink(user.id, appointment.id);
      message = createAppointmentMessage(fullName, date, time, client, link);
      type = "appointmentApproval";
    }
    // Send appointment reminder
    const referenceCode = await send(
      user.id,
      patient.phone,
      message,
      type,
      false
    );
    // Update the appointment with the reference code
    await Appointment.update(
      {
        SMSReferenceCode: referenceCode,
        ...(appointment.reminderStatus !== "approved" && {
          ReminderStatus: "sent",
        }),
      },
      { where: { AppointmentId: appointment.id } }
    );
  } catch (error) {
    !error.code && log.error.error(error);
    throw error;
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

  try {
    // Prepare the message
    fullName = `${patient.name} ${patient.surname.substring(
      0,
      1
    )}`.toLocaleUpperCase("TR");
    fullName =
      fullName.length > MAX_PATIENT_LENGTH
        ? fullName.substring(0, MAX_PATIENT_LENGTH - 1) + "*"
        : fullName + "*";
    client = patient.user.name
      ? patient.user.name.toLocaleUpperCase("TR").length > MAX_CLIENT_LENGTH
        ? patient.user.name
            .toLocaleUpperCase("TR")
            .substring(0, MAX_CLIENT_LENGTH - 1) + "*"
        : patient.user.name.toLocaleUpperCase("TR")
      : null;

    // Create message
    message = createPaymentMessage(fullName, client, patient.dept);

    // Send payment reminder & decrease the SMS limit
    await send(
      patient.user.id,
      patient.phone,
      message,
      "paymentReminder",
      false
    );
  } catch (error) {
    !error.code && log.error.error(error);
    throw error;
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
      `Sn. ${fullName}\\n${date} ${time} tarihindeki diş hekimi randevunuzu onaylamanız gerekmektedir.` +
      `\\n\\nOnay/İptal/Değişiklik için tıklayın:\\n${url}` +
      (client ? `\\n\\n${client}` : "") +
      `\\nSaygılarımızla.`
    );
  } else {
    return (
      `Sn. ${fullName}\\n${date} ${time} tarihindeki diş hekimi randevunuzu hatırlatırız.\\n` +
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
      `Sn. ${fullName}\\nDiş tedavinizden ${dept} TL tutarında ödemeniz bulunmaktadır. En kısa sürede ödeme işleminizi tamamlayınız.\\n` +
      (client ? `\\n${client}` : "") +
      `\\nSaygılarımızla.`
    );
  } else {
    return (
      `Sn. ${fullName}\\nTarihi geçmiş bir ödemeniz bulunmaktadır. En kısa sürede ödeme işleminizi tamamlayınız.\\n` +
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

    return `${HOST}/confirm/${token}`;
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
