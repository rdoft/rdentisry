const db = require("../models");
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;
const Patient = db.patient;

/**
 * Get notification list
 */
exports.getNotifications = async (req, res) => {
  const { UserId: userId } = req.user;
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
      where: {
        UserId: userId,
        ...(status && { Status: status }),
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
  const { UserId: userId } = req.user;
  const { notificationId } = req.params;
  const { status } = req.body;
  let notification;

  try {
    // Find notification
    notification = await Notification.findOne({
      where: {
        NotificationId: notificationId,
        UserId: userId,
      },
    });

    if (notification) {
      // Update notification
      await notification.update({
        Status: status,
      });

      res.status(200).send({ id: notificationId });
    } else {
      res.status(404).send({ message: "Bildirim mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update the all Notifications
 */
exports.updateNotifications = async (req, res) => {
  const { UserId: userId } = req.user;
  const { status } = req.body;

  try {
    // Update status of all notifications
    await Notification.update(
      { Status: status },
      {
        where: {
          UserId: userId,
        },
      }
    );

    res.status(200).send({});
  } catch (error) {
    res.status(500).send(error);
  }
};
