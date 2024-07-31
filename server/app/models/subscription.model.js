module.exports = (sequelize, Sequelize) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      SubscriptionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      StartDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      EndDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      MaxDoctors: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      MaxPatients: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 75,
      },
    },
    {
      timestamps: false,
      tableName: "Subscription",
    }
  );

  return Subscription;
};
