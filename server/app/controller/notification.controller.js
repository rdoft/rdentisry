const db = require("../models");
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;
const Patient = db.patient;

/**
 * Get notification list
 */
exports.getNotifications = async (req, res) => {
  const { status } = req.query;
  let notifications;

  try {
    // Find notifications
    notifications = await Notification.findAll({
      attributes: [
        ["NotificationId", "id"],
        ["createdAt", "timestamp"],
        ["Message", "message"],
        ["Status", "status"],
      ],
      where: status && {
        Status: status,
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["IdNumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
        },
        {
          model: NotificationEvent,
          as: "notificationEvent",
          attributes: [
            ["NotificationEventId", "id"],
            ["Event", "event"],
            ["Type", "type"],
          ],
        },
      ],
    });

    res.status(200).send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update the Notification
 * @param notificationId: Id of the Notification
 */
exports.updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { status } = req.body;
  let notification;

  try {
    // Find notification
    notification = await Notification.findByPk(notificationId);

    if (notification) {
      // Update notification
      await notification.update({
        Status: status,
      });

      res.status(200).send({ id: notificationId });
    } else {
      res.status(404).send({ message: "Böyle bir bildirim bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
