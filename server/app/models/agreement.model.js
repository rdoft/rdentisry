module.exports = (sequelize, Sequelize) => {
  const Agreement = sequelize.define(
    "Agreement",
    {
      AgreementId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      IP: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Agent: {
        type: Sequelize.STRING(511),
        allowNull: true,
      },
      Device: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      IsMobile: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Agreement",
    }
  );

  return Agreement;
};
