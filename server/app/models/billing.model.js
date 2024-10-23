module.exports = (sequelize, Sequelize) => {
  const Billing = sequelize.define("Billing", {
    BillingId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Status: {
      type: Sequelize.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    Amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    PaymentDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IdNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^\d{11}$/,
      },
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Surname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    City: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Phone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^\d{10}$/,
      },
    },
    UUID: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    PaymentToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return Billing;
};
