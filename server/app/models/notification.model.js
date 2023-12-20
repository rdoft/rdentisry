module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      NotificationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      NotificationEventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      Message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["sent", "read", "dismissed"],
      },
    },
    {
      timestamps: true,
      tableName: "Notification",
    }
  );

  return Notification;
};
