module.exports = (sequelize, Sequelize) => {
  const PatientProcedure = sequelize.define(
    "PatientProcedure",
    {
      PatientProcedureId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ProcedureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ToothNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      IsComplete: {
        type: Sequelize.BOOLEAN,
      },
    },
    {
      timestamps: false,
      tableName: "PatientProcedure",
    }
  );

  return PatientProcedure;
};
