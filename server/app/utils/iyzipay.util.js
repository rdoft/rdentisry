const log = require("../config/log.config");
const iyzipay = require("../config/iyzipay.config");

/**
 * Subscription initialize (checkout)
 * @param {Object} req customer, pricing plan, billing and callback
 * @return status, token and checkout form
 */
const checkoutInitialize = async (req) => {
  await new Promise((resolve, reject) => {
    iyzipay.subscriptionCheckoutForm.initialize(req, function (error, result) {
      // Handle Iyzico API error
      if (error || !result) {
        log.error.error(error);
        return reject(
          new Error(
            "Ödeme başlatırken ödeme sağlayıcısı ile bir iletişim hatası oluştu."
          )
        );
      }
      // Handle Iyzico result based on status
      if (result.status === "success") {
        log.app.info(`Iyzipay checkout initialize completed`, {
          success: true,
          email: req.customer.email,
          pricingPlan: req.pricingPlanReferenceCode,
        });
      } else {
        const { errorCode, errorGroup, errorName, errorMessage } = result;
        log.app.warn(`Iyzipay checkout initialize failed`, {
          success: false,
          email: req.customer.email,
          error: {
            code: errorCode,
            group: errorGroup,
            name: errorName,
            message: errorMessage,
          },
        });
      }
      resolve(result);
    });
  });
};

/**
 * Verification of the checkout process
 * @param {Object} req token
 * @return status and data of the subscription
 */
const checkoutRetrieve = async (req) => {
  await new Promise((resolve, reject) => {
    iyzipay.subscriptionCheckoutForm.retrieve(req, function (error, result) {
      // Handle Iyzico API error
      if (error || !result) {
        log.error.error(error);
        return reject(
          new Error(
            "Ödeme sırasında, ödeme sağlayıcısı ile iletişim bir iletişim hatası oluştu."
          )
        );
      }
      // Handle Iyzico result based on status
      if (result.status === "success") {
        log.app.info(`Iyzipay checkout retrieve completed`, {
          success: true,
          token: req.token,
        });
      } else {
        const { errorCode, errorGroup, errorName, errorMessage } = result;
        log.app.warn(`Iyzipay checkout retrieve failed`, {
          success: false,
          token: req.token,
          error: {
            code: errorCode,
            group: errorGroup,
            name: errorName,
            message: errorMessage,
          },
        });
      }
      resolve(result);
    });
  });
};

/**
 * Update the pricing plan of the subscription
 * @param {Object} req reference codes for subscription and pricing plan
 * @return status
 */
const upgrade = async (req) => {
  await new Promise((resolve, reject) => {
    iyzipay.subscription.upgrade(req, function (error, result) {
      // Handle Iyzico API error
      if (error || !result) {
        log.error.error(error);
        return reject(
          new Error(
            "Abonelik ödeme planı güncellenirken, ödeme sağlayıcısı ile bir iletişim hatası oluştu."
          )
        );
      }
      // Handle Iyzico result based on status
      if (result.status === "success") {
        log.app.info(`Iyzipay upgrade completed`, {
          success: true,
          subscription: req.subscriptionReferenceCode,
          pricingPlan: newPricingPlanReferenceCode,
        });
      } else {
        const { errorCode, errorGroup, errorName, errorMessage } = result;
        log.app.warn(`Iyzipay upgrade failed`, {
          success: false,
          subscription: req.subscriptionReferenceCode,
          pricingPlan: newPricingPlanReferenceCode,
          error: {
            code: errorCode,
            group: errorGroup,
            name: errorName,
            message: errorMessage,
          },
        });
      }
      resolve(result);
    });
  });
};

/**
 * Cancel the subscription
 * @param {Object} req reference code for the subscription
 * @return status
 */
const cancel = async (req) => {
  await new Promise((resolve, reject) => {
    iyzipay.subscription.cancel(req, function (error, result) {
      // Handle Iyzico API error
      if (error || !result) {
        log.error.error(error);
        return reject(
          new Error(
            "Abonelik iptal edilirken, ödeme sağlayıcısı ile bir iletişim hatası oluştu."
          )
        );
      }
      // Handle Iyzico result based on status
      if (result.status === "success") {
        log.app.info(`Iyzipay cancel completed`, {
          success: true,
          subscription: req.subscriptionReferenceCode,
        });
      } else {
        const { errorCode, errorGroup, errorName, errorMessage } = result;
        log.app.warn(`Iyzipay cancel failed`, {
          success: false,
          subscription: req.subscriptionReferenceCode,
          error: {
            code: errorCode,
            group: errorGroup,
            name: errorName,
            message: errorMessage,
          },
        });
      }
      resolve(result);
    });
  });
};

/**
 * Update the card information of the subscription
 * @param {Object} req reference code for the subscription and callback
 * @return status
 */
const updateCard = async (req) => {
  await new Promise((resolve, reject) => {
    iyzipay.subscriptionCard.updateWithSubscriptionReferenceCode(
      req,
      function (error, result) {
        // Handle Iyzico API error
        if (error || !result) {
          log.error.error(error);
          return reject(
            new Error(
              "Abonelik kart bilgileri güncellenirken, ödeme sağlayıcısı ile bir iletişim hatası oluştu."
            )
          );
        }
        // Handle Iyzico result based on status
        if (result.status === "success") {
          log.app.info(`Iyzipay update card completed`, {
            success: true,
            subscription: req.subscriptionReferenceCode,
          });
        } else {
          const { errorCode, errorGroup, errorName, errorMessage } = result;
          log.app.warn(`Iyzipay update card failed`, {
            success: false,
            subscription: req.subscriptionReferenceCode,
            error: {
              code: errorCode,
              group: errorGroup,
              name: errorName,
              message: errorMessage,
            },
          });
        }
        resolve(result);
      }
    );
  });
};

module.exports = {
  checkoutInitialize,
  checkoutRetrieve,
  upgrade,
  cancel,
  updateCard,
};
