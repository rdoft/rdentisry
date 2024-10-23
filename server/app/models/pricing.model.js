// TODO: Create pricing plan and product in iyzico
module.exports = (sequelize, Sequelize) => {
  const Pricing = sequelize.define(
    "Pricing",
    {
      PricingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ReferenceCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Name: {
        type: Sequelize.ENUM(
          "dentist-basic",
          "dentist-mid",
          "dentist-pro",
          "clinic-basic",
          "clinic-mid",
          "clinic-pro",
          "polyclinic-basic",
          "polyclinic-mid",
          "polyclinic-pro"
        ),
        allowNull: false,
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      DoctorCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      PatientCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      SMSCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      StorageSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["ReferenceCode"],
        },
      ],
    }
  );

  return Pricing;
};
