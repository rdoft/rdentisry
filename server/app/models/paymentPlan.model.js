module.exports = (sequelize, Sequelize) => {
  const PaymentPlan = sequelize.define(
    "PaymentPlan",
    {
      PaymentPlanId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      PlannedDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "PaymentPlan",
    }
  );

  return PaymentPlan;
};
