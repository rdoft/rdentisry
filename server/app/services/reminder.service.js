const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Patient = db.patient;
const Appointment = db.appointment;
const UserSetting = db.userSetting;

const { send } = require("../utils/sms.util");
const {
  createAppointmentMessage,
  createApprovalLink,
} = require("../utils/reminder.util");

// Define the reminder intervals in days
const APPOINTMENT_FIRST_REMINDER = 5; // Days before appointment
const APPOINTMENT_LAST_REMINDER = 1; // Days before appointment

/**
 * Sends the first appointment reminder with approval link.
 */
async function sendAppointmentApproveReminders() {
  let startDate;
  let endDate;
  let appointments;
  let patient;
  let user;
  let client;
  let fullName;
  let date;
  let link;
  let message;

  try {
    startDate = new Date();
    endDate = new Date();
    startDate.setDate(startDate.getDate() + APPOINTMENT_LAST_REMINDER + 1);
    endDate.setDate(endDate.getDate() + APPOINTMENT_FIRST_REMINDER);

    appointments = await Appointment.findAll({
      attributes: [
        ["AppointmentId", "id"],
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["ReminderStatus", "reminderStatus"],
        ["Status", "status"],
      ],
      where: {
        Date: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
        ReminderStatus: { [Sequelize.Op.eq]: null }, // No reminder sent yet
        Status: { [Sequelize.Op.eq]: "active" }, // Appointment status is 'active'
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["Phone", "phone"],
            ["IsSMS", "isSMS"],
          ],
          required: true,
          include: [
            {
              model: User,
              as: "user",
              attributes: [
                ["UserId", "id"],
                ["Name", "name"],
              ],
              required: true,
              include: [
                {
                  model: UserSetting,
                  as: "userSetting",
                  attributes: [],
                  where: {
                    AppointmentReminder: true, // User wants appointment reminders
                  },
                },
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    for (const appointment of appointments) {
      patient = appointment.patient;
      user = appointment.patient.user;

      // Skip sending if the patient doesn't want SMS
      // Create message and send reminder
      if (patient.isSMS) {
        link = await createApprovalLink(user.id, appointment.id);
        fullName = `${patient.name} ${patient.surname}`.toLocaleUpperCase("TR");
        fullName =
          fullName.length > 30 ? fullName.substring(0, 30) + "..." : fullName;
        time = new Date(
          `1970-01-01T${appointment.startTime}Z`
        ).toLocaleTimeString("tr-TR", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
        });
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

        message = createAppointmentMessage(fullName, date, time, client, link);
        const success = await send(patient.phone, message);
        if (success) {
          await Appointment.update(
            { ReminderStatus: "sent" },
            { where: { AppointmentId: appointment.id } }
          );
        }
      }
    }

    log.app.info(
      `Service: Sent appointment approve reminders between ${startDate} - ${endDate}`
    );
  } catch (error) {
    log.error.error(error);
  }
}

/**
 * Sends the last appointment reminder (without approval link) for appointments not yet rejected.
 */
async function sendAppointmentReminders() {
  let reminderDate;
  let appointments;
  let patient;
  let user;
  let client;
  let fullName;
  let date;
  let message;

  try {
    reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + APPOINTMENT_LAST_REMINDER);

    appointments = await Appointment.findAll({
      attributes: [
        ["AppointmentId", "id"],
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["ReminderStatus", "reminderStatus"],
        ["Status", "status"],
      ],
      where: {
        Date: {
          [Sequelize.Op.eq]: reminderDate,
        },
        ReminderStatus: { [Sequelize.Op.ne]: "rejected" }, // Not rejected
        Status: { [Sequelize.Op.eq]: "active" }, // Appointment status is 'active'
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["Phone", "phone"],
            ["IsSMS", "isSMS"],
          ],
          required: true,
          include: [
            {
              model: User,
              as: "user",
              attributes: [["Name", "name"]],
              required: true,
              include: [
                {
                  model: UserSetting,
                  as: "userSetting",
                  attributes: [],
                  where: {
                    AppointmentReminder: true, // User wants appointment reminders
                  },
                },
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    for (const appointment of appointments) {
      patient = appointment.patient;
      user = appointment.patient.user;

      // Skip sending if the patient doesn't want reminders
      // Create message and send reminder
      if (patient.isSMS) {
        fullName = `${patient.name} ${patient.surname}`.toLocaleUpperCase("TR");
        fullName =
          fullName.length > 30 ? fullName.substring(0, 30) + "..." : fullName;
        time = new Date(
          `1970-01-01T${appointment.startTime}Z`
        ).toLocaleTimeString("tr-TR", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
        });
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

        message = createAppointmentMessage(fullName, date, time, client);
        await send(patient.phone, message);
      }
    }

    log.app.info(
      `Service: Sent appointment reminders for ${reminderDate} appointments`
    );
  } catch (error) {
    log.error.error(error);
  }
}

/**
 * Run function to trigger appointment and payment reminders.
 * This function will be called by node-cron.
 */
exports.run = async () => {
  await Promise.all([
    sendAppointmentApproveReminders(),
    sendAppointmentReminders(),
  ]);
};
