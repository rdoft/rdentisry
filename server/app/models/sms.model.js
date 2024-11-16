module.exports = (sequelize, Sequelize) => {
  const SMS = sequelize.define(
    "SMS",
    {
      SMSId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ReferenceCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: /^\d{10}$/,
        },
      },
      Status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["sent", "delivered", "failed"],
      },
      Message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: [
          "appointmentReminder",
          "appointmentApproval",
          "paymentReminder",
        ],
      },
      IsAuto: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      Error: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CreatedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      DeliveredDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      Retry: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "SMS",
    }
  );

  return SMS;
};
