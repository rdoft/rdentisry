module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      InvoiceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientProcedureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Description: {
        type: Sequelize.STRING(511),
        allowNull: true,
      },
      Amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: (amount) => {
            if (amount < 0) {
              throw new Error("Amount must be positive");
            }
          },
        },
      },
      Discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["PatientProcedureId"],
        },
      ],
      timestamps: false,
      tableName: "Invoice",
    }
  );

  return Invoice;
};
