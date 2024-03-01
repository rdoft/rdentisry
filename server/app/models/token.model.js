module.exports = (sequelize, Sequelize) => {
  const Token = sequelize.define(
    "Token",
    {
      TokenId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Expiration: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "Token",
    }
  );

  return Token;
};
