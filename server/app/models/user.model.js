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
        defaultValue: "",
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
      Agreement: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      Verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ReferralCode: {
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
        {
          unique: true,
          fields: ["ReferralCode"],
        },
      ],
      timestamps: false,
      tableName: "User",
    }
  );

  return User;
};
