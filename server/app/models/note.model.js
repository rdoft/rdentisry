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
      Title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Detail: {
        type: Sequelize.TEXT,
      },
    },
    {
      timestamps: true,
      createdAt: false,
      updatedAt: "Date",
      tableName: "Note",
    }
  );

  return Note;
};
