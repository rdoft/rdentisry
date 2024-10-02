const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Token = db.token;
const Patient = db.patient;
const Appointment = db.appointment;

const { send } = require("../utils/sms.util");
const crypto = require("crypto");

const { HOSTNAME, HOST_SERVER } = process.env;
const HOST = HOSTNAME || HOST_SERVER || "localhost";

/**
 * Send reminder for given appointment
 * @param {Appointment} appointment - The appointment to send the reminder for.
 */
async function sendAppointmentReminder(appointment) {
  let patient;
  let user;
  let client;
  let fullName;
  let date;
  let link;
  let message;

  try {
    patient = appointment.patient;
    user = patient.user;

    // Prepare the message
    client = user.name.toLocaleUpperCase("TR");
    client = client.length > 30 ? client.substring(0, 30) + "..." : client;
    fullName = `${patient.name} ${patient.surname}`.toLocaleUpperCase("TR");
    fullName =
      fullName.length > 30 ? fullName.substring(0, 30) + "..." : fullName;
    date = `${appointment.date} ${appointment.startTime.substring(0, 5)}`;

    // Create message with approval link or not based on the reminder status
    if (appointment.reminderStatus === "approved") {
      message = createAppointmentMessage(fullName, date, client);
    } else {
      link = await createApprovalLink(user.id, appointment.id);
      message = createAppointmentMessage(fullName, date, client, link);
      await Appointment.update(
        { ReminderStatus: "sent" },
        { where: { AppointmentId: appointment.id } }
      );
    }

    // Send appointment reminder
    await send(patient.phone, message);
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

  try {
    // Prepare the message
    client = patient.user.name.toLocaleUpperCase("TR");
    client = client.length > 30 ? client.substring(0, 30) + "..." : client;
    fullName = `${patient.name} ${patient.surname}`.toLocaleUpperCase("TR");
    fullName =
      fullName.length > 30 ? fullName.substring(0, 30) + "..." : fullName;

    // Create message
    message = createPaymentMessage(fullName, client, patient.dept);

    // Send payment reminder
    await send(patient.phone, message);
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
function createAppointmentMessage(fullName, date, client, url) {
  if (url) {
    return `Sn. ${fullName}, ${date} tarihinde olan diş hekimi randevunuzu hatırlatırız. Randevu katılım durumunuzu belirtmeniz gerekmektedir. 
      \nOnay, iptal ve değişiklik için: ${url}\n\n${client}\nSaygılarımızla.`;
  } else {
    return `Sn. ${fullName}, ${date} tarihinde olan diş hekimi randevunuzu hatırlatırız.
      \n\n${client}\nSaygılarımızla.`;
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
    return `Sn. ${fullName}, Diş tedavinizde toplam ${dept} TL tutarında bekleyen ödemeniz bulunmaktadır. Lütfen en kısa sürede ödemenizi yapınız. 
      \n\n${client}\nSaygılarımızla.`;
  } else {
    return `Sn. ${fullName}, Diş tedavinizde tarihi geçmiş ödeme bulunmaktadır. Lütfen en kısa sürede ödemenizi yapınız. 
      \n\n${client}\nSaygılarımızla.`;
  }
}

/**
 * Create url for appointment approval
 * @param {String} userId - The id of the user.
 * @param {String} appointmentId - The id of the appointment.
 */
async function createApprovalLink(userId, appointmentId) {
  let token;

  try {
    token = crypto.randomBytes(32).toString("hex") + ":" + appointmentId;
    await Token.upsert(
      {
        UserId: userId,
        Token: token,
        Expiration: new Date(Date.now() + 172800000), // 2 days
        Type: "reminder",
      },
      {
        where: { UserId: userId, Type: "reminder" },
      }
    );

    return `https://${HOST}/reminder/${token}`;
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
