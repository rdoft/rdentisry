module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      PaymentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: (amount) => {
            if (amount >= 0) {
              throw new Error("Amount must be positive");
            }
          },
        },
      },
      ActualDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      PlannedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Payment",
    }
  );

  return Payment;
};
