module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      UserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      AccountExpiration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "User",
    },
  );

  return User;
};