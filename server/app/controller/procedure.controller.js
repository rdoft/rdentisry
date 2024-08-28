const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Procedure = db.procedure;
const ProcedureCategory = db.procedureCategory;

/**
 * Get Procedure list
 */
exports.getProcedures = async (req, res) => {
  const { UserId: userId } = req.user;
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
      where: {
        UserId: userId,
      },
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
    log.audit.info(`Get procedures completed`, {
      userId,
      action: "GET",
      success: true,
      request: {
        query: req.query,
      },
      resource: {
        type: "procedure",
        count: procedures.length,
      },
    });
  } catch (error) {
    res.status(500).send(procedures);
  }
};

/**
 * Get the procedure with given id
 * @param procedureId id of the procedure
 */
exports.getProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
  const { procedureId } = req.params;
  let procedure;

  try {
    // Find procedure
    procedure = await Procedure.findOne({
      attributes: [
        ["ProcedureId", "id"],
        ["Code", "code"],
        ["Name", "name"],
        ["Price", "price"],
      ],
      where: {
        ProcedureId: procedureId,
        UserId: userId,
      },
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
      log.audit.info(`Get procedure completed`, {
        userId,
        action: "GET",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    } else {
      res.status(404).send({ message: "Tedavi mevcut değil" });
      log.audit.warn("Get Procedure failed: Procedure doesn't exist", {
        userId,
        action: "GET",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Add a Procedure
 * @body Procedure information
 */
exports.saveProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
  const { code, name, price, procedureCategory } = req.body;
  let values = {
    ProcedureCategoryId: procedureCategory?.id ?? null,
    Code: code,
    Name: name,
    Price: price,
    UserId: userId,
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
    log.audit.info(`Save procedure completed`, {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "procedure",
        id: procedure.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı işlem koduna sahip yeni bir tedavi oluşturulamaz",
      });
      log.audit.warn("Save Procedure failed: Validation error", {
        userId,
        action: "POST",
        success: false,
        resource: {
          type: "procedure",
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Update the procedure
 * @param procedureId: Id of the Procedure
 * @body Procedure informations
 */
exports.updateProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
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
    procedure = await Procedure.findOne({
      where: {
        ProcedureId: procedureId,
        UserId: userId,
      },
    });

    if (procedure) {
      // Update the procedure
      await procedure.update(values);

      res.status(200).send({ id: procedureId });
      log.audit.info(`Update procedure completed`, {
        userId,
        action: "PUT",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    } else {
      res.status(404).send({ message: "Tedavi mevcut değil" });
      log.audit.warn("Update Procedure failed: Procedure doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    }
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message:
          "Tedavi zaten mevcut, aynı işlem koduna sahip yeni bir tedavi oluşturulamaz",
      });
      log.audit.warn("Update Procedure failed: Validation error", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Delete procedures of the given Ids
 * @query ids: Id list of procedures
 */
exports.deleteProcedures = async (req, res) => {
  const { UserId: userId } = req.user;
  const { procedureId } = req.query;
  let procedureIds;
  let count = 0;

  try {
    // Convert query string  to array
    procedureIds = procedureId ? procedureId.split(",") : [];
    // Delete procedures
    if (procedureIds.length > 0) {
      count = await Procedure.destroy({
        where: {
          UserId: userId,
          ProcedureId: {
            [Sequelize.Op.in]: procedureIds,
          },
        },
      });
    }

    res.status(200).send({ coun: count });
    log.audit.info(`Delete procedures completed`, {
      userId,
      action: "DELETE",
      success: true,
      request: {
        query: req.query,
      },
      resource: {
        type: "procedure",
        count,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.warn("Delete Procedures failed: Validation error", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          query: req.query,
        },
        resource: {
          type: "procedure",
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Delete the procedure
 * @param procedureId: Id of the procedure
 */
exports.deleteProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
  const { procedureId } = req.params;
  let procedure;

  try {
    // Find procedure
    procedure = await Procedure.findOne({
      where: {
        ProcedureId: procedureId,
        UserId: userId,
      },
    });

    // Delete the procedure if it exists
    if (procedure) {
      await procedure.destroy();

      res.status(200).send({ id: procedureId });
      log.audit.info(`Delete procedure completed`, {
        userId,
        action: "DELETE",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    } else {
      res.status(404).send({ message: "Tedavi mevcut değil" });
      log.audit.warn("Delete Procedure failed: Procedure doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.warn("Delete Procedure failed: Validation error", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "procedure",
          id: procedureId,
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};
