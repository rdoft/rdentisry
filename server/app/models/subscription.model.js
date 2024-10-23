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
      PricingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ReferenceCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Status: {
        type: Sequelize.ENUM("pending", "active", "passive", "cancelled"),
        allowNull: false,
        defaultValue: "active",
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
      MaxSMS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 150,
      },
      MaxStorage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1024, // in MB
      },
      PaymentToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Subscription",
    }
  );

  return Subscription;
};
