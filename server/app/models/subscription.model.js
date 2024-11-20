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
      Doctors: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 0,
        },
      },
      Patients: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 75,
        validate: {
          min: 0,
        },
      },
      SMS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 150,
        validate: {
          min: 0,
        },
      },
      Storage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1024.0, // in MB
        validate: {
          min: 0,
        },
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
