module.exports = (sequelize, Sequelize) => {
  const Procedure = sequelize.define(
    "Procedure",
    {
      ProcedureId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ProcedureCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      Code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(511),
        allowNull: false,
      },
      Price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["Code"],
        },
      ],
      timestamps: false,
      tableName: "Procedure",
    }
  );

  return Procedure;
};
