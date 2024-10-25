const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Token = db.token;
const Visit = db.visit;
const Doctor = db.doctor;
const Patient = db.patient;
const Payment = db.payment;
const PaymentPlan = db.paymentPlan;
const Appointment = db.appointment;
const PatientProcedure = db.patientProcedure;

const { processPatientsPayments } = require("../utils/payment.util");
const {
  sendPaymentReminder,
  sendAppointmentReminder,
} = require("../utils/reminder.util");
const crypto = require("crypto");

/**
 * Send appointment reminder to the patient
 * @query appointmentId: Id of the Appointment
 */
exports.remindAppointment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { appointmentId } = req.query;
  let appointment;

  try {
    appointment = await Appointment.findOne({
      attributes: [
        ["AppointmentId", "id"],
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["Status", "status"],
        ["ReminderStatus", "reminderStatus"],
      ],
      where: { AppointmentId: appointmentId },
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
          include: [
            {
              model: User,
              as: "user",
              attributes: [
                ["UserId", "id"],
                ["Name", "name"],
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    // If the appointment is not found, throw an error
    if (!appointment) {
      res.status(404).send({ message: "Randevu mevcut değil" });
      log.app.warn(
        "Send appointment reminder failed: Appointment doesn't exist",
        {
          userId,
          appointmentId,
          success: false,
        }
      );
      return;
    }

    // Skip sending if the patient doesn't want SMS
    if (!appointment.patient.isSMS) {
      res.status(400).send({ message: "Hastanın SMS hatırlatma izni yoktur" });
      log.app.warn(
        "Send appointment reminder failed: Patient doesn't have permission for SMS",
        {
          userId,
          appointmentId,
          success: false,
        }
      );
      return;
    }
    // Only send reminders for appointments with status 'active'
    if (appointment.status !== "active") {
      res.status(400).send({
        message:
          "Hatırlatma gönderebilmek için randevu durumu 'Bekliyor' olmalıdır",
      });
      log.app.warn(
        "Send appointment reminder failed: Appointment status is not active",
        {
          userId,
          appointmentId,
          success: false,
        }
      );
      return;
    }
    // Skip sending if the appointment reminder status is already rejected
    if (appointment.reminderStatus === "rejected") {
      res.status(400).send({
        message:
          "Randevu onayı daha önce reddedilmiş olduğundan hatırlatma gönderilemez",
      });
      log.app.warn(
        "Send appointment reminder failed: Appointment reminder status is already rejected",
        {
          userId,
          appointmentId,
          success: false,
        }
      );
      return;
    }
    // Skip sending if the appointment reminder status is already updated
    if (appointment.reminderStatus === "updated") {
      res.status(400).send({
        message:
          "Randevu için güncelleme talebi bulunduğundan hatırlatma gönderilemez",
      });
      log.app.warn(
        "Send appointment reminder failed: Appointment reminder status is already updated",
        {
          userId,
          appointmentId,
          success: false,
        }
      );
      return;
    }
    
    // Send appointment reminder
    const success = await sendAppointmentReminder(appointment);
    if (success) {
      res.status(200).send({ message: "Randevu hatırlatma mesajı gönderildi" });
      log.app.info("Send appointment reminder completed", {
        userId,
        appointmentId,
        success: true,
      });
    } else {
      res
        .status(400)
        .send({ message: "Randevu hatırlatma mesajı gönderilemedi" });
      log.app.warn("Send appointment reminder failed: SMS couldn't be sent", {
        userId,
        appointmentId,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Send payment reminder to the patient
 * @query patientId: Id of the Patient
 */
exports.remindPayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.query;
  let patient;

  try {
    patient = await Patient.findOne({
      attributes: [
        ["PatientId", "id"],
        ["Name", "name"],
        ["Surname", "surname"],
        ["Phone", "phone"],
        ["IsSMS", "isSMS"],
      ],
      where: { PatientId: patientId },
      include: [
        {
          model: User,
          as: "user",
          attributes: [["Name", "name"]],
        },
        {
          model: Payment,
          as: "payments",
          attributes: [
            ["PaymentId", "id"],
            ["Amount", "amount"],
            ["IsPlanned", "isPlanned"],
          ],
          required: false,
        },
        {
          model: PaymentPlan,
          as: "paymentPlans",
          attributes: [
            ["PaymentPlanId", "id"],
            ["Amount", "amount"],
            ["PlannedDate", "plannedDate"],
          ],
          required: false,
        },
        {
          model: Visit,
          as: "visits",
          attributes: [
            ["VisitId", "id"],
            ["Discount", "discount"],
          ],
          where: {
            ApprovedDate: {
              [Sequelize.Op.ne]: null,
            },
          },
          required: false,
          include: [
            {
              model: PatientProcedure,
              as: "patientProcedures",
              attributes: [
                ["PatientProcedureId", "id"],
                ["Price", "price"],
              ],
              where: {
                CompletedDate: {
                  [Sequelize.Op.ne]: null,
                },
              },
              required: false,
            },
          ],
        },
      ],
      order: [
        [{ model: PaymentPlan, as: "paymentPlans" }, "PlannedDate", "ASC"],
        [{ model: PaymentPlan, as: "paymentPlans" }, "PaymentPlanId", "ASC"],
      ],
    });
    patient = patient?.toJSON();

    // If the patient is not found, throw an error
    if (!patient) {
      res.status(404).send({ message: "Hasta mevcut değil" });
      log.app.warn("Send payment reminder failed: Patient doesn't exist", {
        userId,
        patientId,
        success: false,
      });
      return;
    }
    // Skip sending if the patient doesn't want SMS
    if (!patient.isSMS) {
      res.status(400).send({ message: "Hastanın SMS hatırlatma izni yoktur" });
      log.app.warn(
        "Send payment reminder failed: Patient doesn't have permission for SMS",
        {
          userId,
          patientId,
          success: false,
        }
      );
      return;
    }

    // Process the patient's payment information
    processPatientsPayments([patient]);

    // If the patient has no payment information, throw an error
    if (!patient) {
      res.status(404).send({ message: "Hasta ödeme bilgisi bulunamadı" });
      log.app.warn(
        "Send payment reminder failed: Patient has no payment information",
        {
          userId,
          patientId,
          success: false,
        }
      );
      return;
    }
    // If the patient has no overdue or debt, throw an error
    if (!patient.overdue && patient.dept <= 0) {
      res.status(400).send({ message: "Hasta borcu veya gecikmesi yoktur" });
      log.app.warn(
        "Send payment reminder failed: Patient has no overdue or debt",
        {
          userId,
          patientId,
          success: false,
        }
      );
      return;
    }

    // Send payment reminder
    const success = await sendPaymentReminder(patient);
    if (success) {
      res.status(200).send({ message: "Ödeme hatırlatma mesajı gönderildi" });
      log.app.info("Send payment reminder completed", {
        userId,
        patientId,
        success: true,
      });
    } else {
      res
        .status(400)
        .send({ message: "Ödeme hatırlatma mesajı gönderilemedi" });
      log.app.warn("Send payment reminder failed: SMS couldn't be sent", {
        userId,
        patientId,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Approve, reject or update an appointment reminder by patient
 * @param {string} token - The token to control.
 * @body {string} action - The action to take. "approved", "rejected", "updated"
 */
exports.action = async (req, res) => {
  const { token } = req.params;
  const { action } = req.body; // "approved", "rejected", "updated"
  let user;
  let appointment;
  let appointmentId;

  try {
    // Check if the action is valid
    if (
      action !== "approved" &&
      action !== "rejected" &&
      action !== "updated"
    ) {
      res.status(400).send({ message: "Geçersiz işlem" });
      log.app.warn("Update appointment reminder failed: Invalid action", {
        token,
        success: false,
      });
      return;
    }

    // Find the user with the token
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          where: {
            Type: "reminder",
            Token: token,
            Expiration: { [Sequelize.Op.gt]: new Date() },
          },
          required: true,
        },
      ],
    });

    // If the user or token not found, throw an error
    if (!user) {
      res
        .status(400)
        .send({ message: "Doğrulama linki geçersiz veya süresi dolmuştur" });
      log.app.warn(
        "Update appointment reminder failed: Token doesn't exist or expired",
        {
          token,
          success: false,
        }
      );
      return;
    }

    // Time safe comparison of the token
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      res
        .status(400)
        .send({ message: "Doğrulama linki geçersiz veya süresi dolmuştur" });
      log.app.warn(
        "Update appointment reminder failed: Token doesn't exist or expired",
        {
          token,
          success: false,
        }
      );
      return;
    }

    // Delete the token
    await Token.destroy({
      where: {
        UserId: user.UserId,
        Token: token,
      },
    });
    log.app.info("Update appointment reminder token found and deleted", {
      userId: user.UserId,
      token,
      success: true,
    });

    // Parse the token to get the appointment
    appointmentId = token.split(":")[1];
    appointment = await Appointment.findOne({
      attributes: [
        ["AppointmentId", "id"],
        ["ReminderStatus", "reminderStatus"],
        ["Status", "status"],
      ],
      where: { AppointmentId: appointmentId },
      raw: true,
    });

    // Control the appointment is compatible, throw an error
    if (!appointment || appointment.status !== "active") {
      res.status(404).send({
        message:
          "Aktif randevu bulunamadı. İptal edilmiş veya silinmiş olabilir. Lütfen iletişime geçin",
      });
      log.app.warn(
        "Update appointment reminder failed: Appointment doesn't exist or not active",
        {
          token,
          success: false,
        }
      );
      return;
    }

    // Update the appointment reminder status
    await Appointment.update(
      {
        ReminderStatus: action,
      },
      {
        where: { AppointmentId: appointmentId },
      }
    );

    res
      .status(200)
      .send({ message: "Randevu durumunuz başarıyla güncellendi" });
    log.app.info("Update appointment reminder completed", {
      token,
      success: true,
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Control token and send record
 * @param {string} token - The token to control.
 * @returns {Appointment} - The appointment record.
 */
exports.controlTokenAppointment = async (req, res) => {
  const { token } = req.params;
  let user;
  let appointment;
  let appointmentId;

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          where: {
            Type: "reminder",
            Token: token,
            Expiration: { [Sequelize.Op.gt]: new Date() },
          },
          required: true,
        },
      ],
    });

    // If the user or token not found, send an error
    if (!user) {
      res
        .status(400)
        .send({ message: "Doğrulama linki geçersiz veya süresi dolmuştur" });
      log.access.warn("Control token failed: Token doesn't exist or expired", {
        token,
        success: false,
        action: "CONTROL",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Time safe comparison of the token
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      res
        .status(400)
        .send({ message: "Doğrulama linki geçersiz veya süresi dolmuştur" });
      log.access.warn("Control token failed: Token doesn't exist or expired", {
        token,
        success: false,
        action: "CONTROL",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Parse the token to get the appointment
    appointmentId = token.split(":")[1];
    appointment = await Appointment.findOne({
      attributes: [
        ["AppointmentId", "id"],
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["Status", "status"],
      ],
      where: { AppointmentId: appointmentId },
      include: [
        {
          model: Doctor,
          as: "doctor",
          attributes: [
            ["DoctorId", "id"],
            ["Name", "name"],
            ["Surname", "surname"],
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    // Control the appointment is compatible, send an error
    if (!appointment || appointment.status !== "active") {
      res.status(404).send({
        message:
          "Randevu bulunamadı. İptal edilmiş veya silinmiş olabilir. Lütfen iletişime geçin",
      });
      log.access.warn(
        "Control token failed: Appointment doesn't exist or not active",
        {
          token,
          success: false,
          action: "CONTROL",
          request: {
            ip: req.headers["x-forwarded-for"],
            agent: req.headers["user-agent"],
          },
        }
      );
      return;
    }

    appointment.startTime = new Date(`1970-01-01T${appointment.startTime}Z`);
    appointment.endTime = new Date(`1970-01-01T${appointment.endTime}Z`);
    appointment.doctor = appointment.doctor?.id ? appointment.doctor : null;

    res.status(200).send(appointment);
    log.access.info("Control token success", {
      userId: user.UserId,
      token,
      success: true,
      action: "CONTROL",
      request: {
        ip: req.headers["x-forwarded-for"],
        agent: req.headers["user-agent"],
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
