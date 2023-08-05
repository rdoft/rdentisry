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
 * Get the procedure with given id
 * @param procedureId id of the procedure
 */
exports.getProcedure = async (req, res) => {
  const { procedureId } = req.params;
  let procedure;

  try {
    // Find procedure
    procedure = await Procedure.findByPk(procedureId, {
      attributes: [
        ["ProcedureId", "id"],
        ["Code", "code"],
        ["Name", "name"],
        ["Price", "price"],
      ],
      include: [
        {
          model: ProcedureCategory,
          as: "procedureCategory",
          attributes: [
            ["ProcedureCategoryId", "id"],
            ["Title", "title"],
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    if (procedure) {
      res.status(200).send(procedure);
    } else {
      res.status(404).send({ message: "İşlem bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a Procedure
 * @body Procedure information
 */
exports.saveProcedure = async (req, res) => {
  const { code, name, price, procedureCategory } = req.body;
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
      procedureCategoryId: procedure.procedureCategoryId,
    };
    res.status(201).send(procedure);
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı işlem koduna sahip yeni bir işlem oluşturulamaz",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Update the procedure
 * @param procedureId: Id of the Procedure
 * @body Procedure informations
 */
exports.updateProcedure = async (req, res) => {
  const { procedureId } = req.params;
  const { code, name, price, procedureCategory } = req.body;
  let values = {
    Code: code,
    Name: name,
    Price: price,
    ProcedureCategoryId: procedureCategory ? procedureCategory.id : null,
  };
  let procedure;

  try {
    // Find Procedure
    procedure = await Procedure.findByPk(procedureId);

    if (procedure) {
      // Update the procedure
      await procedure.update(values);

      res.status(200).send({ id: procedureId });
    } else {
      res.status(404).send({ message: "Böyle bir işlem mevcut değil" });
    }
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "İşlem kodu mevcut, aynı işlem koduna sahip yeni bir işlem oluşturulamaz",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Delete the procedure
 * @param procedureId: Id of the procedure
 */
exports.deleteProcedure = async (req, res) => {
  const { procedureId } = req.params;
  let procedure;

  try {
    // Find procedure
    procedure = await Procedure.findOne({
      where: {
        ProcedureId: procedureId,
      },
    });

    // Delete the procedure if it exists
    if (procedure) {
      await procedure.destroy();

      res.status(200).send({ id: procedureId });
    } else {
      res.status(404).send({ message: "İşlem bulunamadı" });
    }
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      res
        .status(400)
        .send({ message: "Silmek istediğiniz işlem bazı hastalarınızda kullanılmış olduğundan işlem tamamlanamadı" });
    } else {
      res.status(500).send(error);
    }
  }
};
