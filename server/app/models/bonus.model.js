module.exports = (sequelize, Sequelize) => {
  const Bonus = sequelize.define(
    "Bonus",
    {
      BonusId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      DoctorCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      PatientCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      SMSCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      StorageSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      EndDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Bonus",
    }
  );

  return Bonus;
};
