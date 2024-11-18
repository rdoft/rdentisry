const log = require("../config/log.config");
const config = require("../config/db.config");
const fs = require("fs");
const { parse } = require("csv-parse");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  port: config.PORT,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  logging: config.logging,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require("./user.model")(sequelize, Sequelize);
db.token = require("./token.model")(sequelize, Sequelize);
db.subscription = require("./subscription.model")(sequelize, Sequelize);
db.userSetting = require("./userSetting.model")(sequelize, Sequelize);
db.agreement = require("./agreement.model")(sequelize, Sequelize);
db.patient = require("./patient.model")(sequelize, Sequelize);
db.doctor = require("./doctor.model")(sequelize, Sequelize);
db.appointment = require("./appointment.model")(sequelize, Sequelize);
db.note = require("./note.model")(sequelize, Sequelize);
db.payment = require("./payment.model")(sequelize, Sequelize);
db.paymentPlan = require("./paymentPlan.model")(sequelize, Sequelize);
db.visit = require("./visit.model")(sequelize, Sequelize);
db.procedure = require("./procedure.model")(sequelize, Sequelize);
db.patientProcedure = require("./patientProcedure.model")(sequelize, Sequelize);
db.notification = require("./notification.model")(sequelize, Sequelize);
db.pricing = require("./pricing.model")(sequelize, Sequelize);
db.billing = require("./billing.model")(sequelize, Sequelize);
db.bonus = require("./bonus.model")(sequelize, Sequelize);
db.sms = require("./sms.model")(sequelize, Sequelize);
db.referral = require("./referral.model")(sequelize, Sequelize);
db.notificationEvent = require("./notificationEvent.model")(
  sequelize,
  Sequelize
);
db.procedureCategory = require("./procedureCategory.model")(
  sequelize,
  Sequelize
);

// Relationships
// patient - appointment (one to many)
db.patient.hasMany(db.appointment, {
  as: "appointments",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.appointment.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// patient - note (one to many)
db.patient.hasMany(db.note, {
  as: "notes",
  foreignKey: "PatientId",
  onDelete: "cascade",
  hooks: true,
});
db.note.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// patient - payment (one to many)
db.patient.hasMany(db.payment, {
  as: "payments",
  foreignKey: "PatientId",
});
db.payment.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// patient - paymentPlan (one to many)
db.patient.hasMany(db.paymentPlan, {
  as: "paymentPlans",
  foreignKey: "PatientId",
});
db.paymentPlan.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// patient - visit (one to many)
db.patient.hasMany(db.visit, {
  as: "visits",
  foreignKey: "PatientId",
});
db.visit.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// doctor - appointment (one to many)
db.doctor.hasMany(db.appointment, {
  as: "appointments",
  foreignKey: "DoctorId",
  onDelete: "set null",
  hooks: true,
});
db.appointment.belongsTo(db.doctor, {
  as: "doctor",
  foreignKey: "DoctorId",
});

// procedureCategory - procedure (one to many)
db.procedureCategory.hasMany(db.procedure, {
  as: "procedures",
  foreignKey: "ProcedureCategoryId",
});
db.procedure.belongsTo(db.procedureCategory, {
  as: "procedureCategory",
  foreignKey: "ProcedureCategoryId",
});

// procedure - patientProcedure (one to many)
db.procedure.hasMany(db.patientProcedure, {
  as: "patientProcedures",
  foreignKey: "ProcedureId",
});
db.patientProcedure.belongsTo(db.procedure, {
  as: "procedure",
  foreignKey: "ProcedureId",
});

// visit - patientProcedure (one to many)
db.visit.hasMany(db.patientProcedure, {
  as: "patientProcedures",
  foreignKey: "VisitId",
  onDelete: "cascade",
  hooks: true,
});
db.patientProcedure.belongsTo(db.visit, {
  as: "visit",
  foreignKey: "VisitId",
});

// notificationEvent - notification (one to many)
db.notificationEvent.hasMany(db.notification, {
  as: "notifications",
  foreignKey: "NotificationEventId",
});
db.notification.belongsTo(db.notificationEvent, {
  as: "notificationEvent",
  foreignKey: "NotificationEventId",
});

// patient - notification (one to many)
db.patient.hasMany(db.notification, {
  as: "notifications",
  foreignKey: "PatientId",
});
db.notification.belongsTo(db.patient, {
  as: "patient",
  foreignKey: "PatientId",
});

// User - Patient
db.user.hasMany(db.patient, {
  as: "patients",
  foreignKey: "UserId",
});
db.patient.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Doctor
db.user.hasMany(db.doctor, {
  as: "doctors",
  foreignKey: "UserId",
});
db.doctor.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Procedure
db.user.hasMany(db.procedure, {
  as: "procedures",
  foreignKey: "UserId",
});
db.procedure.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Notification
db.user.hasMany(db.notification, {
  as: "notifications",
  foreignKey: "UserId",
});
db.notification.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Token
db.user.hasMany(db.token, {
  as: "tokens",
  foreignKey: "UserId",
});
db.token.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Subscription
db.user.hasMany(db.subscription, {
  as: "subscriptions",
  foreignKey: "UserId",
  onDelete: "cascade",
  hooks: true,
});
db.subscription.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// user - userSettings (one to one)
db.user.hasOne(db.userSetting, {
  as: "userSetting",
  foreignKey: "UserId",
  onDelete: "cascade",
  hooks: true,
});
db.userSetting.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Agreement
db.user.hasOne(db.agreement, {
  as: "agreement",
  foreignKey: "UserId",
});
db.agreement.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Bill
db.user.hasMany(db.billing, {
  as: "billings",
  foreignKey: "UserId",
});
db.billing.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Bonus
db.user.hasOne(db.bonus, {
  as: "bonus",
  foreignKey: "UserId",
  onDelete: "cascade",
  hooks: true,
});
db.bonus.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - SMS
db.user.hasMany(db.sms, {
  as: "sms",
  foreignKey: "UserId",
  onDelete: "cascade",
  hooks: true,
});
db.sms.belongsTo(db.user, {
  as: "user",
  foreignKey: "UserId",
});

// User - Referral
db.user.hasMany(db.referral, {
  as: "referrals",
  foreignKey: "ReffererId",
  onDelete: "cascade",
  hooks: true,
});
db.referral.belongsTo(db.user, {
  as: "refferer",
  foreignKey: "ReffererId",
});
db.referral.belongsTo(db.user, {
  as: "referred",
  foreignKey: "ReferredId",
});

// Pricing - Subscription
db.pricing.hasMany(db.subscription, {
  as: "subscriptions",
  foreignKey: "PricingId",
  onDelete: "set null",
  hooks: true,
});
db.subscription.belongsTo(db.pricing, {
  as: "pricing",
  foreignKey: "PricingId",
});

// HOOKS -----------------------------------------------
// Control If doctor has any appointments before destroy
db.doctor.beforeDestroy(async (doctor) => {
  const appointmentCount = await doctor.countAppointments({
    where: {
      Status: "active",
    },
  });
  if (appointmentCount > 0) {
    throw new Sequelize.ValidationError(
      "Doktora ait aktif randevular olduğundan işlem tamamlanamadı"
    );
  }
});

// Control If patient has any payments before destroy
db.patient.beforeDestroy(async (patient) => {
  const appointmentCount = await patient.countAppointments({
    where: {
      Status: "active",
    },
  });
  const visitCount = await patient.countVisits({
    where: {
      ApprovedDate: {
        [Sequelize.Op.ne]: null,
      },
    },
  });
  const paymentCount = await patient.countPayments();
  const paymentPlanCount = await patient.countPaymentPlans();
  const noteCount = await patient.countNotes();

  if (
    paymentCount > 0 ||
    paymentPlanCount > 0 ||
    visitCount > 0 ||
    appointmentCount > 0 ||
    noteCount > 0
  ) {
    throw new Sequelize.ValidationError(
      "Hastaya ait kayıtlar olduğundan işlem tamamlanamadı"
    );
  }
});

// Control If patient has any appointments before bulk destroy
db.patient.beforeBulkDestroy(async (options) => {
  const patientId = options.where.PatientId;

  const appointmentCount = await db.appointment.count({
    where: {
      PatientId: patientId,
      Status: "active",
    },
  });
  const visitCount = await db.visit.count({
    where: {
      PatientId: patientId,
      ApprovedDate: {
        [Sequelize.Op.ne]: null,
      },
    },
  });
  const paymentCount = await db.payment.count({
    where: {
      PatientId: patientId,
    },
  });
  const paymentPlanCount = await db.paymentPlan.count({
    where: {
      PatientId: patientId,
    },
  });
  const noteCount = await db.note.count({
    where: {
      PatientId: patientId,
    },
  });

  if (
    paymentCount > 0 ||
    paymentPlanCount ||
    visitCount > 0 ||
    appointmentCount > 0 ||
    noteCount > 0
  ) {
    throw new Sequelize.ValidationError(
      "Hastalara ait kayıtlar olduğundan işlem tamamlanamadı"
    );
  }
});

// Control If procedure has been used before destroy
db.procedure.beforeDestroy(async (procedure) => {
  const patientCount = await procedure.countPatientProcedures();
  if (patientCount > 0) {
    throw new Sequelize.ValidationError(
      "Tedavi bazı hastalarınızda kullanılmış olduğundan işlem tamamlanamadı"
    );
  }
});

// Control If procedure has any patients before bulk destroy
db.procedure.beforeBulkDestroy(async (options) => {
  const patientCount = await db.patientProcedure.count({
    where: {
      ProcedureId: options.where.ProcedureId,
    },
  });
  if (patientCount > 0) {
    throw new Sequelize.ValidationError(
      "Tedaviler bazı hastalarınızda kullanılmış olduğundan işlem tamamlanamadı"
    );
  }
});

// Hook to delete visits after patientProcedure update
db.patientProcedure.afterUpdate(async (patientProcedure) => {
  // Get the previous visit ID
  const previousVisitId = patientProcedure._previousDataValues.VisitId;

  if (previousVisitId) {
    const oldVisit = await db.visit.findOne({
      where: { VisitId: previousVisitId },
      include: [
        {
          model: db.patientProcedure,
          as: "patientProcedures",
        },
      ],
    });

    if (oldVisit && oldVisit.patientProcedures.length === 0) {
      oldVisit.destroy();
    }
  }
});

// Control if there is empty visit when delete patientProcedure,
// if empty then destroy visit
db.patientProcedure.afterDestroy(async (patientProcedure) => {
  const visit = await db.visit.findOne({
    where: {
      VisitId: patientProcedure.VisitId,
    },
    include: [
      {
        model: db.patientProcedure,
        as: "patientProcedures",
      },
    ],
  });

  if (visit && visit.patientProcedures.length === 0) {
    visit.destroy();
  }
});

// Control If user has any patients or doctors before destroy
db.user.beforeDestroy(async (user) => {
  const patientCount = await user.countPatients();
  const doctorCount = await user.countDoctors();
  const billCount = await user.countBillings();
  if (patientCount > 0 || doctorCount > 0 || billCount > 0) {
    throw new Sequelize.ValidationError(
      "Kullanıcıya ait hasta, doktor ve fatura kayıtları olduğundan işlem tamamlanamadı"
    );
  }
});

// Create procedures ans subscription when new user added
db.user.afterCreate(async (user) => {
  await createCategories();
  await createProcedures(user);
  await createReferralCode(user);
  await db.subscription.create({
    UserId: user.UserId,
  });
  await db.userSetting.create({
    UserId: user.UserId,
  });
});

// Create pricing records when application starts
db.sequelize.sync().then(async () => {
  const pricingCount = await db.pricing.count();
  if (pricingCount === 0) {
    await createPricing();
  }
});

// If procedure categories don't exist, then create new records from csv
const createCategories = async () => {
  const PATH_CATEGORY_CSV = `${__dirname}/../data/ProcedureCategory.csv`;

  try {
    const parser = fs
      .createReadStream(PATH_CATEGORY_CSV)
      .pipe(parse({ delimiter: ",", from_line: 2 }));

    for await (const row of parser) {
      await db.procedureCategory.findOrCreate({
        where: {
          ProcedureCategoryId: row[0],
          Title: row[1],
        },
      });
    }
  } catch (error) {
    log.error.error(error);
    throw new Error(
      "Bir problem oluştu, uygulama yöneticisi ile iletişime geçin"
    );
  }
};

// Create new procedure records for currently added user
const createProcedures = async (user) => {
  const PATH_PROCEDURE_CSV = `${__dirname}/../data/Procedure.csv`;

  try {
    const parser = fs
      .createReadStream(PATH_PROCEDURE_CSV)
      .pipe(parse({ delimiter: ",", from_line: 2 }));

    for await (const row of parser) {
      await db.procedure.create({
        UserId: user.UserId,
        ProcedureCategoryId: row[1] || null,
        Code: row[2],
        Name: row[3],
        Price: row[4],
      });
    }
  } catch (error) {
    log.error.error(error);
    throw new Error(
      "Bir problem oluştu, uygulama yöneticisi ile iletişime geçin"
    );
  }
};

// Create pricing records from csv
const createPricing = async () => {
  const PATH_PRICING_CSV = `${__dirname}/../data/Pricing.csv`;

  try {
    const parser = fs
      .createReadStream(PATH_PRICING_CSV)
      .pipe(parse({ delimiter: ",", from_line: 2 }));

    for await (const row of parser) {
      await db.pricing.create({
        ReferenceCode: row[0],
        Name: row[1],
        Price: row[2],
        DoctorCount: row[3] || null,
        PatientCount: row[4] || null,
        SMSCount: row[5] || null,
        StorageSize: row[6] || null,
      });
    }
  } catch (error) {
    log.error.error(error);
    throw new Error(
      "Bir problem oluştu, uygulama yöneticisi ile iletişime geçin"
    );
  }
};

// Create refferal link for the user
const createReferralCode = async (user) => {
  const referralCode = Buffer.from(`ref-${user.UserId}`).toString("base64");
  await user.update({ ReferralCode: referralCode });
};

module.exports = db;
