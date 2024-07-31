const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");

// Appointment specific imports
const controller = require("../controller/notification.controller");

// Constants
const API_URL = "/api";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  // Control user authentication
  router.use(isAuthenticated);

  router
    .route(`/notifications`)
    /**
     * Get notification list
     */
    .get(controller.getNotifications)
    /**
     * Update the all Notifications
     */
    .put(controller.updateNotifications);

  router
    .route(`/notifications/:notificationId`)
    /**
     * Update the Notification
     * @param notificationId: Id of the Notification
     */
    .put(controller.updateNotification);

  app.use(API_URL, router);
};
