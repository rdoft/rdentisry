module.exports = (sequelize, Sequelize) => {
  const ProcedureCategory = sequelize.define(
    "ProcedureCategory",
    {
      ProcedureCategoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["Title"],
        },
      ],
      timestamps: false,
      tableName: "ProcedureCategory",
    }
  );

  return ProcedureCategory;
};
