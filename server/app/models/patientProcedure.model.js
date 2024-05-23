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
      InvoiceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CompletedDate: {
        type: Sequelize.DATEONLY,
      },
      Price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: (price) => {
            if (price < 0) {
              throw new Error("Price must be positive");
            }
          },
        },
      },
    },
    {
      timestamps: false,
      tableName: "PatientProcedure",
    }
  );

  return PatientProcedure;
};
