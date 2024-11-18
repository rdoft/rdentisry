module.exports = (sequelize, Sequelize) => {
  const NotificationEvent = sequelize.define(
    "NotificationEvent",
    {
      NotificationEventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Event: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["overdue", "upcoming", "dept", "bonus"],
      },
      Type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["payment", "appointment", "referral"],
      },
    },
    {
      timestamps: false,
      tableName: "NotificationEvent",
    }
  );

  return NotificationEvent;
};
