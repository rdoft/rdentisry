const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const ProcedureCategory = db.procedureCategory;

/**
 * Get procedure categories
 */
exports.getProcedureCategories = async (req, res) => {
  let categories;

  try {
    // Find categories
    categories = await ProcedureCategory.findAll({
      attributes: [
        ["ProcedureCategoryId", "id"],
        ["Title", "title"],
      ],
    });

    res.status(200).send(categories);
    log.audit.info(`Get procedure categories completed`, {
      action: "GET",
      success: true,
      resource: {
        type: "procedureCategory",
        count: categories.length,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Add a category
 * @body category information
 */
exports.saveProcedureCategory = async (req, res) => {
  const { title } = req.body;
  let values = {
    Title: title,
  };
  let category;

  try {
    // Create category
    category = await ProcedureCategory.create(values);
    category = {
      id: category.ProcedureCategoryId,
      title: category.Title,
    };

    res.status(201).send(category);
    log.audit.info(`Save procedure category completed`, {
      action: "POST",
      success: true,
      resource: {
        type: "procedureCategory",
        id: category.id,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({
        message: "Boş veya mevcut kategori eklenemez",
      });
      log.audit.warn("Save procedure category failed: Validation error", {
        action: "POST",
        success: false,
        resource: {
          type: "procedureCategory",
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Delete the category
 * @param procedureCategoryId: Id of the category
 */
exports.deleteProcedureCategory = async (req, res) => {
  const { procedureCategoryId } = req.params;
  let category;

  try {
    if (!parseInt(procedureCategoryId)) {
      res.status(400).send({ message: "Geçersiz istek" });
      log.audit.warn("Delete procedure category failed: Invalid request", {
        action: "DELETE",
        success: false,
        resource: {
          type: "procedureCategory",
          id: procedureCategoryId,
        },
      });
      return;
    }

    // Find Category
    category = await ProcedureCategory.findByPk(procedureCategoryId);

    // Delete the category if it exists
    if (category) {
      await category.destroy();

      res.status(200).send({ id: procedureCategoryId });
      log.audit.info(`Delete procedure category completed`, {
        action: "DELETE",
        success: true,
        resource: {
          type: "procedureCategory",
          id: procedureCategoryId,
        },
      });
    } else {
      res.status(404).send({ message: "Kategori mevcut değil" });
      log.audit.warn(
        "Delete procedure category failed: Category doesn't exist",
        {
          action: "DELETE",
          success: false,
          resource: {
            type: "procedureCategory",
            id: procedureCategoryId,
          },
        }
      );
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
