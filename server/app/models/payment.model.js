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
            if (amount < 0) {
              throw new Error("Amount must be positive");
            }
          },
        },
      },
      ActualDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: new Date(),
      },
      IsPlanned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: "Payment",
    }
  );

  return Payment;
};
