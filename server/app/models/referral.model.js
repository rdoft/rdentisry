module.exports = (sequelize, Sequelize) => {
  const Referral = sequelize.define(
    "Referral",
    {
      ReferralId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ReferrerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ReferredId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Status: {
        type: Sequelize.ENUM("pending", "success"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["ReferrerId", "ReferralId"],
        },
      ],
      timestamps: false,
      tableName: "Referral",
    }
  );

  return Referral;
};
