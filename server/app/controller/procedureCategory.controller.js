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
  } catch (error) {
    res.status(500).send(error);
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
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({
        message: "Boş veya mevcut kategori eklenemez",
      });
    } else {
      res.status(500).send(error);
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
      return res.status(400).send({ message: "Geçersiz istek" });
    }

    // Find Category
    category = await ProcedureCategory.findByPk(procedureCategoryId);

    // Delete the category if it exists
    if (category) {
      await category.destroy();

      res.status(200).send({ id: procedureCategoryId });
    } else {
      res.status(404).send({ message: "Kategori bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
