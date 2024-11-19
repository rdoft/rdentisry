const log = require("../config/log.config");
const db = require("../models");
const User = db.user;
const Referral = db.referral;
const UserSetting = db.userSetting;

const bcrypt = require("bcrypt");

/**
 * Get the user
 * userId is taken from the request itself
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
 * Get referral code of the user
 * userId and subscription is taken from the request itself
 */
exports.getReferralCode = async (req, res) => {
  const { UserId: userId } = req.user;
  const subscription = req.subscription;
  let user;

  try {
    // Control if the user has an active subscription (except free)
    if (!subscription.ReferenceCode) {
      res
        .status(404)
        .send({ message: "Aktif ücretli abonelik bulunmamaktadır" });
      log.audit.warn(`Get referral code failed: Subscription doesn't exist`, {
        userId,
        action: "GET",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    // Get the user and send the referral code
    user = await User.findByPk(userId);
    if (user) {
      const referredCount = await Referral.count({
        where: {
          ReferrerId: userId,
          Status: "success",
        },
      });

      let referralCode;
      if (user.ReferralCode) {
        referralCode = user.ReferralCode;
      } else {
        referralCode = Buffer.from(`ref-${userId}`).toString("base64");
        await user.update({
          ReferralCode: referralCode,
        });
      }

      res.status(200).send({ referralCode, referredCount });
      log.audit.info(`Get referral code completed`, {
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
      log.audit.warn(`Get referral code failed: User doesn't exist`, {
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
 * userId is taken from the request itself
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
 * userId is taken from the request itself
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
 * userId is taken from the request itself
 * @body settings - The user's settings like apointmentReminder
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
