module.exports = (sequelize, Sequelize) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      AppointmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      DoctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      StartTime: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          min: "00:00:00",
          max: "23:59:59",
        },
      },
      EndTime: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          min: (time) => {
            if (this.StartTime < time) {
              throw new Error("EndTime must be after StartTime");
            }
          },
          max: "23:59:59",
        },
      },
      Description: {
        type: Sequelize.TEXT,
      },
      Status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["active", "completed", "canceled", "absent"],
      },
      ReminderStatus: {
        type: Sequelize.ENUM,
        allowNull: true,
        values: ["sent", "approved", "rejected", "updated"],
      },
      SMSReferenceCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Appointment",
    }
  );

  return Appointment;
};
