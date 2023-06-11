const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
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
db.patient = require("./patient.model")(sequelize, Sequelize);
db.doctor = require("./doctor.model")(sequelize, Sequelize);
db.appointment = require("./appointment.model")(sequelize, Sequelize);
db.note = require("./note.model")(sequelize, Sequelize);
db.payment = require("./payment.model")(sequelize, Sequelize);
db.procedure = require("./procedure.model")(sequelize, Sequelize);
db.procedureCategory = require("./procedureCategory.model")(
  sequelize,
  Sequelize
);
db.patientProcedure = require("./patientProcedure.model")(sequelize, Sequelize);

// Relationships
// patient - appointment (one to many)
db.patient.hasMany(db.appointment, {
  as: "Appointments",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.appointment.belongsTo(db.patient, {
  as: "Patient",
  foreignKey: "PatientId",
});

// patient - note (one to many)
db.patient.hasMany(db.note, {
  as: "Notes",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.note.belongsTo(db.patient, {
  as: "Patient",
  foreignKey: "PatientId",
});

// patient - payment (one to many)
db.patient.hasMany(db.payment, {
  as: "Payments",
  foreignKey: "PatientId",
});
db.payment.belongsTo(db.patient, {
  as: "Patient",
  foreignKey: "PatientId",
});

// doctor - appointment (one to many)
db.doctor.hasMany(db.appointment, {
  as: "Appointments",
  foreignKey: "DoctorId",
});
db.appointment.belongsTo(db.doctor, {
  as: "Doctor",
  foreignKey: "DoctorId",
});

// procedureCategory - procedure (one to many)
db.procedureCategory.hasMany(db.procedure, {
  as: "Procedures",
  foreignKey: "ProcedureCategoryId",
});
db.procedure.belongsTo(db.procedureCategory, {
  as: "ProcedureCategory",
  foreignKey: "ProcedureCategoryId",
});

// patient - procedure (many to many)
db.patient.belongsToMany(db.procedure, {
  through: "PatientProcedure",
  as: "Procedures",
  foreignKey: "PatientId",
});
db.procedure.belongsToMany(db.patient, {
  through: "PatientProcedure",
  as: "Patients",
  foreignKey: "ProcedureId",
});

// HOOKS
// Control If doctor has any appointments before destroy
db.doctor.beforeDestroy(async (doctor) => {
  const appointmentCount = await doctor.countAppointments();
  if (appointmentCount > 0) {
    throw new Error(
      "Cannot destroy doctor before removing his/her appointments"
    );
  }
});

// Control If patient has any payments before destroy
db.patient.beforeDestroy(async (patient) => {
  const paymentCount = await patient.countPayments();
  if (paymentCount > 0) {
    throw new Error("Cannot destroy patient who has payment records");
  }
});

module.exports = db;
