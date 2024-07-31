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
        allowNull: true,
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
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["Email"],
        },
      ],
      timestamps: false,
      tableName: "User",
    }
  );

  return User;
};
