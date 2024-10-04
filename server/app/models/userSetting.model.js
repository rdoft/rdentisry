module.exports = (sequelize, Sequelize) => {
  const UserSetting = sequelize.define(
    "UserSetting",
    {
      UserSettingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      AppointmentReminder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: "UserSetting",
    }
  );

  return UserSetting;
};


// TODO: Add the controls for user settings in the reminders