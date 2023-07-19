import * as tedious from 'tedious';
const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  dialectModule: tedious,
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

// patient - procedure (many to many)
db.patient.belongsToMany(db.procedure, {
  through: "PatientProcedure",
  as: "procedures",
  foreignKey: "PatientId",
});
db.procedure.belongsToMany(db.patient, {
  through: "PatientProcedure",
  as: "patients",
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

module.exports = db;
