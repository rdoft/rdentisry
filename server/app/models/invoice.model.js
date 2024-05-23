module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      InvoiceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "Aşama",
      },
      Description: {
        type: Sequelize.STRING(511),
        allowNull: true,
      },
      Discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      Date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      timestamps: false,
      tableName: "Invoice",
    }
  );

  return Invoice;
};
