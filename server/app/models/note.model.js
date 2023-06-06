module.exports = (sequelize, Sequelize) => {
  const Note = sequelize.define(
    "Note",
    {
      NoteId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      Detail: {
        type: Sequelize.TEXT,
      },
    },
    {
      timestamps: false,
      tableName: "Note",
    }
  );

  return Note;
};
