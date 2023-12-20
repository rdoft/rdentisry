module.exports = (sequelize, Sequelize) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      DoctorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "Doctor",
    }
  );

  return Doctor;
};
