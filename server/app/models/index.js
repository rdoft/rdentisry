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

// doctor - appointment (one to many)
db.doctor.hasMany(db.appointment, {
  as: "Appointments",
  foreignKey: "DoctorId",
});
db.appointment.belongsTo(db.doctor, {
  as: "Doctor",
  foreignKey: "DoctorId",
});

// Hooks
// Control If doctor has any appointments before destroy
db.doctor.beforeDestroy(async (doctor) => {
  const appointmentCount = await doctor.countAppointments();
  if (appointmentCount > 0) {
    throw new Error(
      "Cannot destroy doctor before removing his/her appointments"
    );
  }
});

module.exports = db;
