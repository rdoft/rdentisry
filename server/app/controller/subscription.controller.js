const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Billing = db.billing;
const Pricing = db.pricing;
const Subscription = db.subscription;

const { HOSTNAME, HOST_SERVER } = process.env;
const HOST = HOSTNAME || HOST_SERVER;

const {
  checkoutInitialize,
  checkoutRetrieve,
  upgrade,
  cancel,
} = require("../utils/iyzipay.util");
const { calcLimits } = require("../utils/subscription.util");

/**
 * Init checkout proccess by creating billing & subscription with pending status
 * @body pricingId and billing information
 * @return id of the subscription and checkout form
 */
exports.checkout = async (req, res) => {
  const { UserId: userId } = req.user;
  const { pricingId, idNumber, name, surname, address, city, country, phone } =
    req.body;

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send({ message: "Kullanıcı bulunamadı" });
      log.audit.warn(
        "Subscription checkout initialize failed: User doesn't exist",
        {
          userId,
          action: "POST",
          success: false,
          resource: {
            type: "subscription",
          },
        }
      );
      return;
    }

    // Check if the pricing exists
    const pricing = await Pricing.findByPk(pricingId);
    if (!pricing) {
      res.status(404).send({ message: "Abonelik planı bulunamadı" });
      log.audit.warn(
        "Subscription checkout initialize failed: Pricing doesn't exist",
        {
          userId,
          action: "POST",
          success: false,
          resource: {
            type: "subscription",
          },
        }
      );
      return;
    }

    // Check if the user has an active subscription
    const subscription = await Subscription.findOne({
      where: {
        UserId: userId,
        Status: "active",
        ReferenceCode: {
          [Sequelize.Op.not]: null,
        },
      },
    });
    if (subscription) {
      res
        .status(400)
        .send({ message: "Abonelik zaten mevcut. Yeni abonelik başlatılamaz" });
      log.audit.warn(
        "Subscription checkout initialize failed: User already has an active subscription",
        {
          userId,
          action: "POST",
          success: false,
          resource: {
            type: "subscription",
            id: subscription.SubscriptionId,
          },
        }
      );
      return;
    }

    // TODO: Remove the redirect port from all the redirect links
    // Init checkout process
    const { status, token, checkoutFormContent, errorMessage } =
      await checkoutInitialize({
        callbackUrl: `https://${HOST}:8080/api/subscriptions/callback`,
        pricingPlanReferenceCode: pricing.ReferenceCode,
        customer: {
          name,
          surname,
          email: user.Email,
          identityNumber: idNumber,
          gsmNumber: `+90${phone}`,
          shippingAddress: {
            contactName: `${name} ${surname}`,
            country,
            city,
            address,
          },
          billingAddress: {
            contactName: `${name} ${surname}`,
            country,
            city,
            address,
          },
        },
      });

    // Check if error on payment gateway
    if (status !== "success") {
      res.status(400).send({ message: errorMessage });
      log.audit.warn(
        "Subscription checkout initialize failed: Payment gateway error",
        {
          userId,
          action: "POST",
          success: false,
          resource: {
            type: "subscription",
          },
        }
      );
      return;
    }

    // Create a new billing with pending status
    await Billing.create({
      UserId: userId,
      Status: "pending",
      PaymentDate: new Date(),
      Amount: pricing.Price,
      Description: pricing.Name,
      IdNumber: idNumber,
      Name: name,
      Surname: surname,
      Address: address,
      City: city,
      Country: country,
      Phone: phone,
      PaymentToken: token,
    });

    // Create a new subscription with pending status
    const { remainDoctors, remainPatients, remainStorage, remainSMS } =
      await calcLimits(userId, pricing);
    await Subscription.create({
      UserId: userId,
      PricingId: pricingId,
      ReferenceCode: null,
      Status: "pending",
      StartDate: new Date(),
      EndDate: null,
      Doctors: remainDoctors,
      Patients: remainPatients,
      SMS: remainSMS,
      Storage: remainStorage,
      PaymentToken: token,
    });

    res.status(201).send({
      checkoutForm: checkoutFormContent,
    });
    log.audit.info("Subscription checkout initialize completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "subscription",
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Callback function of checkout proccess for the payment
 * Get the checkout status and update the subscription and billing status accordingly
 * @body token
 * @return empty response
 */
// TODO: Remove the redirect port from all the redirect links
exports.callback = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      res.redirect(
        `https://${HOST}:3000/checkout/result?status=failed&message=Geçersiz Token`
      );
      log.audit.warn("Subscription callback failed: Token is missing", {
        action: "POST",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    const billing = await Billing.findOne({
      where: {
        PaymentToken: token,
      },
    });
    const subscription = await Subscription.findOne({
      where: {
        PaymentToken: token,
      },
    });
    // Check if the billing and subscription exists
    if (!billing || !subscription) {
      res.redirect(
        `https://${HOST}:3000/checkout/result?status=failed&message=Üyelik Bulunamadı`
      );
      log.audit.warn("Subscription callback failed: Subscription not found", {
        token: token,
        action: "POST",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    // Retrieve the checkout result
    const { status, data, errorMessage } = await checkoutRetrieve({
      checkoutFormToken: token,
    });

    if (status !== "success") {
      // Update the billing status
      await billing.update({
        Status: "failed",
        PaymentDate: new Date(),
        Description: errorMessage,
      });
      // Update the subscription status
      await subscription.update({
        Status: "passive",
        StartDate: new Date(),
      });

      res.redirect(
        `https://${HOST}:3000/checkout/result?status=failed&message=${errorMessage}`
      );
      log.audit.warn("Subscription callback failed: Payment gateway error", {
        userId: subscription.UserId,
        action: "POST",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    // Update the billing status
    await billing.update({
      Status: "paid",
      PaymentDate: new Date(),
    });
    // Update the subscription status and reference code
    await subscription.update({
      Status: "active",
      ReferenceCode: data.referenceCode,
      StartDate: data.startDate,
    });
    // Update free subscription status
    await Subscription.update(
      {
        Status: "passive",
        EndDate: new Date(),
      },
      {
        where: {
          UserId: subscription.UserId,
          ReferenceCode: null,
        },
      }
    );

    res.redirect(
      `https://${HOST}:3000/checkout/result?status=success&referenceCode=${data.referenceCode}`
    );
    log.audit.info("Subscription callback completed", {
      action: "POST",
      success: true,
      resource: {
        type: "subscription",
        id: subscription.SubscriptionId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Get active subscription of the user
 * @user
 * @return active subscription
 */
exports.getSubscription = async (req, res) => {
  const { UserId: userId } = req.user;

  try {
    // Find active subscription
    const subscription = await Subscription.findOne({
      attributes: [
        ["SubscriptionId", "id"],
        ["Status", "status"],
        ["StartDate", "startDate"],
        ["EndDate", "endDate"],
        ["Doctors", "doctors"],
        ["Patients", "patients"],
        ["SMS", "sms"],
        ["Storage", "storage"],
        ["PricingId", "pricingId"],
      ],
      where: {
        UserId: userId,
        Status: "active",
      },
    });

    if (!subscription) {
      res.status(404).send();
      log.audit.warn("Get subscription failed: Subscription not found", {
        userId,
        action: "GET",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    res.status(200).send(subscription);
    log.audit.info("Get subscription completed", {
      userId,
      action: "GET",
      success: true,
      resource: {
        type: "subscription",
        id: subscription.SubscriptionId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Update the pricing plan of the subscription of the user
 * @body pricingId of the new pricing plan
 * @user
 * @return empty response
 */
exports.updateSubscription = async (req, res) => {
  const { UserId: userId } = req.user;
  const { pricingId } = req.body;

  try {
    // Get the active subscription of the user (except free)
    const subscription = await Subscription.findOne({
      where: {
        UserId: userId,
        Status: "active",
        ReferenceCode: {
          [Sequelize.Op.not]: null,
        },
      },
    });
    if (!subscription) {
      res
        .status(404)
        .send({ message: "Aktif abonelik bulunamadı. Yeni abonelik başlatın" });
      log.audit.warn("Update subscription failed: Subscription not found", {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    // Get the pricing
    const pricing = await Pricing.findByPk(pricingId);
    if (!pricing) {
      res.status(404).send({ message: "Ödeme planı bulunamadı" });
      log.audit.warn("Update subscription failed: Pricing not found", {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "pricing",
          id: pricingId,
        },
      });
      return;
    }

    // Update the subscription
    const { data, status, errorMessage } = await upgrade({
      subscriptionReferenceCode: subscription.ReferenceCode,
      newPricingPlanReferenceCode: pricing.ReferenceCode,
      upgradePeriod: "NOW",
    });

    // Check if the udate is successful on payment gateway
    if (status !== "success") {
      res.status(400).send({ message: errorMessage });
      log.audit.warn("Update subscription failed: Payment gateway error", {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    // Create a new subscription with the new pricing plan and make the old one passive
    const { remainDoctors, remainPatients, remainStorage, remainSMS } =
      await calcLimits(userId, pricing);
    await Subscription.create({
      UserId: userId,
      PricingId: pricingId,
      ReferenceCode: data.referenceCode,
      Status: "active",
      StartDate: new Date(),
      EndDate: null,
      Doctors: remainDoctors,
      Patients: remainPatients,
      Storage: remainStorage,
      SMS: remainSMS,
    });
    await subscription.update({
      Status: "passive",
      EndDate: new Date(),
    });

    res.status(200).send();
    log.audit.info("Update subscription completed", {
      userId,
      action: "PUT",
      success: true,
      resource: {
        type: "subscription",
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Cancel the subscription of the user
 * @user
 * @return empty response
 */
exports.cancelSubscription = async (req, res) => {
  const { UserId: userId } = req.user;

  try {
    // Get the active subscription of the user
    const subscription = await Subscription.findOne({
      where: {
        UserId: userId,
        Status: "active",
        ReferenceCode: {
          [Sequelize.Op.not]: null,
        },
      },
    });
    if (!subscription) {
      res.status(404).send({ message: "Aktif aboneliniz bulunamadı" });
      log.audit.warn(
        "Cancel subscription failed: Active subscription not found",
        {
          userId,
          action: "POST",
          success: false,
          resource: {
            type: "subscription",
          },
        }
      );
      return;
    }

    // Cancel the subscription
    const { status, errorMessage } = await cancel({
      subscriptionReferenceCode: subscription.ReferenceCode,
    });

    // Check if the cancelation is successful on payment gateway
    if (status !== "success") {
      res.status(400).send({ message: errorMessage });
      log.audit.warn("Cancel subscription failed: Payment gateway error", {
        userId,
        action: "POST",
        success: false,
        resource: {
          type: "subscription",
        },
      });
      return;
    }

    // Update the subscription status as cancelled
    subscription.update({
      Status: "cancelled",
      EndDate: new Date(),
    });

    res.status(200).send();
    log.audit.info("Cancel subscription completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "subscription",
        id: subscription.SubscriptionId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Get pricing plans
 * @return pricings
 */
exports.getPricings = async (req, res) => {
  try {
    const pricings = await Pricing.findAll({
      attributes: [
        ["PricingId", "id"],
        ["Name", "name"],
        ["Price", "price"],
        ["DoctorCount", "maxDoctors"],
        ["PatientCount", "maxPatients"],
        ["SMSCount", "maxSMS"],
        ["StorageSize", "maxStorage"],
      ],
    });

    res.status(200).send(pricings);
    log.audit.info("Get pricings completed", {
      action: "GET",
      success: true,
      resource: {
        type: "pricing",
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
