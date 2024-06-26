module.exports = (sequelize, Sequelize) => {
  const Visit = sequelize.define(
    "Visit",
    {
      VisitId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      },
      Description: {
        type: Sequelize.STRING(511),
        allowNull: true,
      },
      Discount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      ApprovedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Visit",
    }
  );

  return Visit;
};
