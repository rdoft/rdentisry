const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const UserSetting = db.userSetting;

const bcrypt = require("bcrypt");

/**
 * Get the user
 */
exports.getUser = async (req, res) => {
  const { UserId: userId } = req.user;
  let user;

  try {
    user = await User.findOne({
      attributes: [
        ["Name", "name"],
        ["Email", "email"],
        ["Agreement", "agreement"],
        ["Verified", "verified"],
      ],
      where: {
        UserId: userId,
      },
      include: [
        {
          model: UserSetting,
          as: "userSetting",
          attributes: [["AppointmentReminder", "appointmentReminder"]],
        },
      ],
    });

    if (user) {
      res.status(200).send(user);
      log.audit.info(`Get user completed`, {
        userId,
        action: "GET",
        success: true,
        resource: {
          type: "user",
          id: userId,
        },
      });
    } else {
      res.status(404).send({ message: "Kullanıcı mevcut değil" });
      log.audit.warn("Get user failed: User doesn't exist", {
        userId,
        action: "GET",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Update the user
 * @body name and password
 */
exports.updateUser = async (req, res) => {
  const { UserId: userId } = req.user;
  const { name, oldPassword, password } = req.body;
  let user;

  try {
    user = await User.findOne({
      where: {
        UserId: userId,
      },
    });

    if (!user) {
      res.status(404).send({ message: "Kullanıcı mevcut değil" });
      log.audit.warn(`Update user failed: User doesn't exist`, {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    if (!password) {
      await user.update({
        Name: name,
      });

      res.status(200).send();
      log.audit.info(`Update user completed`, {
        userId,
        action: "PUT",
        success: true,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    // Check if the old password is matched with the user's password
    // It can be null on the db if the user signed up with a social media account
    if ((!user.Password && oldPassword) || (user.Password && !oldPassword)) {
      res.status(400).send({ message: "Eski şifre yanlış" });
      log.access.warn(`Update user failed: Wrong password`, {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    if (user.Password && oldPassword) {
      const isValid = await bcrypt.compare(oldPassword, user.Password);
      if (!isValid) {
        res.status(400).send({ message: "Eski şifre yanlış" });
        log.access.warn(`Update user failed: Wrong password`, {
          userId,
          action: "PUT",
          success: false,
          resource: {
            type: "user",
            id: userId,
          },
        });
        return;
      }
    }

    // Hash the password with the salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.update({
      Password: hashedPassword,
    });

    res.status(200).send();
    log.access.info(`Update user password completed`, {
      userId,
      action: "RESET",
      success: true,
      request: {
        ip: req.headers["x-forwarded-for"],
        agent: req.headers["user-agent"],
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Get the user settings
 */
exports.getSettings = async (req, res) => {
  const { UserId: userId } = req.user;
  let settings;

  try {
    settings = await UserSetting.findOne({
      attributes: [["AppointmentReminder", "appointmentReminder"]],
      where: {
        UserId: userId,
      },
    });

    if (settings) {
      res.status(200).send(settings);
      log.audit.info(`Get user settings completed`, {
        userId,
        action: "GET",
        success: true,
        resource: {
          type: "user",
          id: userId,
        },
      });
    } else {
      res.status(404).send({ message: "Kullanıcı ayarları mevcut değil" });
      log.audit.warn(`Get user settings failed: User settings doesn't exist`, {
        userId,
        action: "GET",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Update the user settings
 * @body preference
 */
exports.updateSettings = async (req, res) => {
  const { UserId: userId } = req.user;
  const { appointmentReminder } = req.body;
  let settings;

  try {
    settings = await UserSetting.findOne({
      where: {
        UserId: userId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: [["Name", "name"]],
        },
      ],
      raw: true,
      nest: true,
    });

    // Control if the user setting exist
    if (!settings) {
      res.status(404).send({ message: "Kullanıcı ayarları mevcut değil" });
      log.audit.warn(
        `Update user settings failed: User settings doesn't exist`,
        {
          userId,
          action: "PUT",
          success: false,
          resource: {
            type: "user",
            id: userId,
          },
        }
      );
      return;
    }

    // Control if the user name exists
    if (!settings.user.name) {
      res.status(400).send({
        message: "Otomatik hatırlatma gönderebilmek için hesap adınızı ekleyin",
      });
      log.audit.warn(`Update user settings failed: User name doesn't exist`, {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    // Update the user settings
    await UserSetting.update(
      {
        AppointmentReminder: appointmentReminder,
      },
      {
        where: {
          UserId: userId,
        },
      }
    );

    res.status(200).send({ id: settings.UserSettingId });
    log.audit.info(`Update user settings completed`, {
      userId,
      action: "PUT",
      success: true,
      resource: {
        type: "user",
        id: userId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
