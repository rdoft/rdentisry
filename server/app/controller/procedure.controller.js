const { Sequelize } = require("../models");
const db = require("../models");
const Procedure = db.procedure;
const ProcedureCategory = db.procedureCategory;

/**
 * Get Procedure list
 */
exports.getProcedures = async (req, res) => {
  const { categoryId } = req.query;
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
      order: [["Code", "ASC"]],
      include: [
        {
          model: ProcedureCategory,
          as: "procedureCategory",
          attributes: [
            ["ProcedureCategoryId", "id"],
            ["Title", "title"],
          ],
          where: categoryId && {
            ProcedureCategoryId: categoryId,
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

/**
 * Add a Procedure
 * @body Procedure information
 */
exports.saveProcedure = async (req, res) => {
  const {
    code,
    name,
    price,
    procedureCategory
  } = req.body;
  let values = {
    ProcedureCategoryId: procedureCategory.id, 
    Code: code,
    Name: name,
    Price: price,
  };
  let procedure;

  try {
    // Create Procedure record
    procedure = await Procedure.create(values);
    procedure = {
      id: procedure.ProcedureId,
      code: procedure.Code,
      name: procedure.Name,
      price: procedure.Price,
      procedureCategoryId: procedure.procedureCategoryId
    };
    res.status(201).send(procedure);
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı koda sahip işlem oluşturulamaz",
      });
    } else {
      res.status(500).send(error);
    }
  }
};
