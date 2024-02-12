const config = require("../config/db.config");
const fs = require("fs");
const { parse } = require("csv-parse");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  port: config.PORT,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require("./user.model")(sequelize, Sequelize);
db.patient = require("./patient.model")(sequelize, Sequelize);
db.doctor = require("./doctor.model")(sequelize, Sequelize);
db.appointment = require("./appointment.model")(sequelize, Sequelize);
db.note = require("./note.model")(sequelize, Sequelize);
db.payment = require("./payment.model")(sequelize, Sequelize);
db.invoice = require("./invoice.model")(sequelize, Sequelize);
db.procedure = require("./procedure.model")(sequelize, Sequelize);
db.procedureCategory = require("./procedureCategory.model")(
  sequelize,
  Sequelize
);
db.patientProcedure = require("./patientProcedure.model")(sequelize, Sequelize);
db.notificationEvent = require("./notificationEvent.model")(
  sequelize,
  Sequelize
);
db.notification = require("./notification.model")(sequelize, Sequelize);

// Relationships
// patient - appointment (one to many)
db.patient.hasMany(db.appointment, {
  as: "appointments",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.appointment.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// patient - note (one to many)
db.patient.hasMany(db.note, {
  as: "notes",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.note.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// patient - payment (one to many)
db.patient.hasMany(db.payment, {
  as: "payments",
  foreignKey: "PatientId",
});
db.payment.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// doctor - appointment (one to many)
db.doctor.hasMany(db.appointment, {
  as: "appointments",
  foreignKey: "DoctorId",
});
db.appointment.belongsTo(db.doctor, {
  as: "doctor",
  foreignKey: "DoctorId",
});

// procedureCategory - procedure (one to many)
db.procedureCategory.hasMany(db.procedure, {
  as: "procedures",
  foreignKey: "ProcedureCategoryId",
});
db.procedure.belongsTo(db.procedureCategory, {
  as: "procedureCategory",
  foreignKey: "ProcedureCategoryId",
});

// patient - patientProcedure (one to many)
db.patient.hasMany(db.patientProcedure, {
  as: "patientProcedures",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.patientProcedure.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// procedure - patientProcedure (one to many)
db.procedure.hasMany(db.patientProcedure, {
  as: "patientProcedures",
  foreignKey: "ProcedureId",
});
db.patientProcedure.belongsTo(db.procedure, {
  as: "procedure",
  foreignKey: "ProcedureId",
});

// patientProcedure - invoice (one to one)
db.patientProcedure.hasOne(db.invoice, {
  as: "invoice",
  foreignKey: "PatientProcedureId",
});
db.invoice.belongsTo(db.patientProcedure, {
  as: "procedure",
  foreignKey: "PatientProcedureId",
});

// notificationEvent - notification (one to many)
db.notificationEvent.hasMany(db.notification, {
  as: "notifications",
  foreignKey: "NotificationEventId",
});
db.notification.belongsTo(db.notificationEvent, {
  as: "notificationEvent",
  foreignKey: "NotificationEventId",
});

// patient - notification (one to many)
db.patient.hasMany(db.notification, {
  as: "notifications",
  foreignKey: "PatientId",
});
db.notification.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// User - Patient
db.user.hasMany(db.patient, {
  as: "patients",
  foreignKey: "UserId",
});
db.patient.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Doctor
db.user.hasMany(db.doctor, {
  as: "doctors",
  foreignKey: "UserId",
});
db.doctor.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Procedure
db.user.hasMany(db.procedure, {
  as: "procedures",
  foreignKey: "UserId",
});
db.procedure.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Notification
db.user.hasMany(db.notification, {
  as: "notifications",
  foreignKey: "UserId",
});
db.notification.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// HOOKS
// Control If doctor has any appointments before destroy
db.doctor.beforeDestroy(async (doctor) => {
  const appointmentCount = await doctor.countAppointments();
  if (appointmentCount > 0) {
    throw new Sequelize.ForeignKeyConstraintError();
  }
});

// Control If patient has any payments before destroy
db.patient.beforeDestroy(async (patient) => {
  const paymentCount = await patient.countPayments();
  if (paymentCount > 0) {
    throw new Sequelize.ForeignKeyConstraintError();
  }
});

// Control If patient has any appointments before bulk destroy
db.patient.beforeBulkDestroy(async (options) => {
  const paymentCount = await db.payment.count({
    where: {
      PatientId: options.where.PatientId,
    },
  });
  if (paymentCount > 0) {
    throw new Sequelize.ForeignKeyConstraintError();
  }
});

// Control If procedure has any patients before destroy
db.procedure.beforeDestroy(async (procedure) => {
  const patientCount = await procedure.countPatientProcedures();
  if (patientCount > 0) {
    throw new Sequelize.ForeignKeyConstraintError();
  }
});

// Control If procedure has any patients before bulk destroy
db.procedure.beforeBulkDestroy(async (options) => {
  const patientCount = await db.patientProcedure.count({
    where: {
      ProcedureId: options.where.ProcedureId,
    },
  });
  if (patientCount > 0) {
    throw new Sequelize.ForeignKeyConstraintError();
  }
});

// Control If user has any patients or doctors before destroy
db.user.beforeDestroy(async (user) => {
  const patientCount = await user.countPatients();
  const doctorCount = await user.countDoctors();
  if (patientCount > 0 || doctorCount > 0) {
    throw new Sequelize.ForeignKeyConstraintError();
  }
});

// Create procedure when new user added
db.user.afterCreate(async (user) => {
  await createCategories();
  await createProcedures(user);
});

// If procedure categories don't exist, then create new records from csv
const createCategories = async () => {
  const PATH_CATEGORY_CSV = `${__dirname}/../data/ProcedureCategory.csv`;

  try {
    const parser = fs
      .createReadStream(PATH_CATEGORY_CSV)
      .pipe(parse({ delimiter: ",", from_line: 2 }));

    for await (const row of parser) {
      await db.procedureCategory.findOrCreate({
        where: {
          ProcedureCategoryId: row[0],
          Title: row[1],
        }
      });
    }
  } catch (error) {
    throw new Error(
      "Bir problem oluştu, uygulama yöneticisi ile iletişime geçin"
    );
  }
};

// Create new procedure records for currently added user
const createProcedures = async (user) => {
  const PATH_PROCEDURE_CSV = `${__dirname}/../data/Procedure.csv`;

  try {
    const parser = fs
      .createReadStream(PATH_PROCEDURE_CSV)
      .pipe(parse({ delimiter: ",", from_line: 2 }));

    for await (const row of parser) {
      await db.procedure.create({
        UserId: user.UserId,
        ProcedureCategoryId: row[1] || null,
        Code: row[2],
        Name: row[3],
        Price: row[4],
      });
    }
  } catch (error) {
    throw new Error(
      "Bir problem oluştu, uygulama yöneticisi ile iletişime geçin"
    );
  }
};

module.exports = db;
