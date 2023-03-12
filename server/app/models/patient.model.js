module.exports = (sequelize, Sequelize) => {
  const Patient = sequelize.define(
    "Patient",
    {
      PatientId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      IdNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: /^\d{11}$/,
        },
      },
      Phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: /^\d{10}$/,
        },
      },
      BirthYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1900,
          max: new Date().getFullYear(),
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["IdNumber"],
        },
      ],
      timestamps: false,
      tableName: "Patient",
    }
  );

  return Patient;
};
