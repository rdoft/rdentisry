module.exports = (sequelize, Sequelize) => {
  const Patient = sequelize.define("Patient", {
    PatientId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Surname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    IdNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^\d{11}$/
      }
    },
    Phone: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /[0-9]{10}/
      }
    },
  }, {
    timestamps: false,
    tableName: "Patient",
  });

  return Patient;
}