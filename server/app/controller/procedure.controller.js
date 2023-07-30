const { Sequelize } = require("../models");
const db = require("../models");
const Procedure = db.procedure;
const ProcedureCategory = db.procedureCategory;

/**
 * Get Procedure list
 */
exports.getProcedures = async (req, res) => {
  const { category } = req.query;
  let procedures;

  try {
    // Find procedure list
    procedures = await Procedure.findAll({
      attributes: [
        ["ProcedureId", "id"],
        ["Code", "code"],
        ["Name", "name"],
        ["Price", "price"],
      ],
      order: [
        ["Code", "ASC"],
      ],
      include: [
        {
          model: ProcedureCategory,
          as: "procedureCategory",
          attributes: [],
          where: category && {
            Title: category,
          },
        },
      ],
      raw: true,
      nest: true,
    });

    res.status(200).send(procedures);
  } catch (error) {
    res.status(500).send(procedures);
  }
};
