const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Token = db.token;
const Referral = db.referral;
const Agreement = db.agreement;

const { controlTokenAppointment } = require("./reminder.controller");
const { sendResetMail, sendVerifyMail } = require("../utils/mail.util");
const dns = require("dns").promises;
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const { HOSTNAME, HOST_SERVER } = process.env;
const HOST = HOSTNAME || HOST_SERVER || "localhost";

exports.login = async (req, res) => {
  res.status(200).send({
    agreement: req.user.Agreement,
    verified: req.user.Verified,
  });
};

exports.logout = async (req, res, next) => {
  const userId = req.user?.UserId || null;

  req.logout((err) => {
    if (err) {
      log.error.error(err);
      return next(err);
    }

    res.status(200).send();
    log.access.info("Logout success", {
      userId: userId,
      success: true,
      action: "LOGOUT",
      request: {
        ip: req.headers["x-forwarded-for"],
        agent: req.headers["user-agent"],
      },
    });
  });
};

exports.register = async (req, res) => {
  const { name, email, password, referralCode } = req.body;
  let user;
  let domain;
  let addr;

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Control if user exists
    user = await User.findOne({
      where: {
        Email: email,
      },
    });
    if (user && user.Password) {
      res.status(400).send({ message: "Mail adresi zaten kayıtlıdır" });
      log.access.warn("Register failed: User already exists", {
        mail: email,
        success: false,
        action: "REGISTER",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Control if email dns is valid
    domain = email.split("@")[1];
    try {
      addr = await dns.resolve(domain);
      if (!addr.length) {
        res.status(400).send({ message: "Mail adresinizi kontrol edin" });
        log.access.warn("Register failed: Invalid email", {
          mail: email,
          success: false,
          action: "REGISTER",
          request: {
            ip: req.headers["x-forwarded-for"],
            agent: req.headers["user-agent"],
          },
        });
        return;
      }
    } catch (error) {
      res.status(400).send({ message: "Mail adresinizi kontrol edin" });
      log.access.warn("Register failed: Invalid email", {
        mail: email,
        success: false,
        action: "REGISTER",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Create user or update record
    if (!user) {
      user = await User.create({
        Name: name,
        Email: email,
        Password: hashedPassword,
      });
      // Create refferal record if referral code exists
      if (referralCode) {
        const referrer = await User.findOne({
          where: {
            ReferralCode: referralCode,
          },
        });
        if (referrer) {
          await Referral.create({
            ReffererId: referrer.UserId,
            ReferredId: user.UserId,
            Status: "pending",
          });
        }
      }
    } else {
      await User.update(
        {
          Name: name,
          Password: hashedPassword,
        },
        {
          where: {
            Email: email,
          },
        }
      );
    }

    log.access.info("Register success", {
      userId: user.UserId,
      mail: email,
      success: true,
      action: "REGISTER",
      request: {
        ip: req.headers["x-forwarded-for"],
        agent: req.headers["user-agent"],
      },
    });

    // Login user
    req.login(user, function (err) {
      if (err) {
        res.status(500).send(err);
        log.error.error(err);
        return;
      }
      res.status(200).send();
      log.access.info("Login success", {
        userId: user.UserId,
        mail: email,
        success: true,
        action: "LOGIN",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(err);
  }
};

exports.google = async (req, res) => {
  if (req.user) {
    res.redirect(`https://${HOST}/`);
  } else {
    res.redirect(`https://${HOST}/login`);
  }
  res.status(200).send();
};

/**
 * Control the token for the given type
 * @param token
 * @query type
 */
exports.controlToken = async (req, res) => {
  const { token } = req.params;
  const { type = "reset" } = req.query; // reset, email or reminder
  let user;

  // Redirect controlToken to reminder appointment if type is "reminder"
  if (type === "reminder") {
    return controlTokenAppointment(req, res);
  }

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          where: {
            Type: type,
            Token: token,
            Expiration: {
              [Sequelize.Op.gt]: Date.now(),
            },
          },
          required: true,
        },
      ],
    });

    // If user or token not found, respond with an error
    if (!user) {
      res.status(400).send({
        message: "Bağlantı linki geçersiz veya süresi dolmuştur",
      });
      log.access.warn("Control token failed: Token doesn't exist or expired", {
        token,
        success: false,
        action: "CONTROL",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Time safe comparison for more security
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      res.status(400).send({
        message: "Bağlantı linki geçersiz veya süresi dolmuştur",
      });
      log.access.warn("Control token failed: Token doesn't exist or expired", {
        token,
        success: false,
        action: "CONTROL",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    res.status(200).send();
    log.access.info("Control token success", {
      userId: user.UserId,
      token,
      success: true,
      action: "CONTROL",
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
 * Forgot password
 * @body User email
 */
exports.forgot = async (req, res) => {
  const { email } = req.body;
  let token;
  let user;

  try {
    token = crypto.randomBytes(32).toString("hex");
    user = await User.findOne({
      where: {
        Email: email,
      },
    });

    if (!user) {
      res.status(404).send({ message: "Geçersiz mail adresi" });
      log.access.warn("Forgot failed: Mail doesn't exist", {
        mail: email,
        success: false,
        action: "RESET",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    await Token.upsert(
      {
        UserId: user.UserId,
        Token: token,
        Expiration: Date.now() + 3600000, // 1 hour
        Type: "reset",
      },
      {
        where: {
          UserId: user.UserId,
          Type: "reset",
        },
      }
    );

    await sendResetMail(email, `https://${HOST}/reset/${token}`);

    res.status(200).send();
    log.access.info("Forgot success", {
      userId: user.UserId,
      mail: email,
      success: true,
      action: "RESET",
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
 * Reset password
 * @body password
 */
exports.reset = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  let user;

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          where: {
            Type: "reset",
            Token: token,
            Expiration: {
              [Sequelize.Op.gt]: Date.now(),
            },
          },
          required: true,
        },
      ],
    });

    // If user or token not found, respond with an error
    if (!user) {
      res.status(400).send({
        message: "Şifre sıfırlama linki geçersiz veya süresi dolmuştur",
      });
      log.access.warn("Reset failed: Token doesn't exist or expired", {
        token,
        success: false,
        action: "RESET",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Time safe comparison for more security
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      res.status(400).send({
        message: "Şifre sıfırlama linki geçersiz veya süresi dolmuştur",
      });
      log.access.warn("Reset failed: Token doesn't exist or expired", {
        token,
        success: false,
        action: "RESET",
        request: {
          ip: req.headers["x-forwarded-for"],
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    // Delete reset token
    await Token.destroy({
      where: {
        UserId: user.UserId,
        Type: "reset",
      },
    });
    log.access.info("Reset token found and deleted", {
      userId: user.UserId,
      token,
      success: true,
      action: "RESET",
      request: {
        ip: req.headers["x-forwarded-for"],
        agent: req.headers["user-agent"],
      },
    });

    // Generate a salt and Hash the password with the salt
    // And update user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.update(
      {
        Password: hashedPassword,
      },
      {
        where: {
          UserId: user.UserId,
        },
      }
    );

    res.status(200).send();
    log.access.info("Reset success", {
      userId: user.UserId,
      success: true,
      action: "RESET",
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
 * Init verify for email
 */
exports.initVerify = async (req, res) => {
  const { email } = req.body;
  let token;
  let user;

  try {
    token = crypto.randomBytes(32).toString("hex");
    user = await User.findOne({
      where: {
        Email: email,
      },
    });

    if (!user) {
      res.status(404).send({ message: "Geçersiz kullanıcı" });
      log.app.warn("Init verify email failed: User doesn't exist", {
        mail: email,
        success: false,
      });
      return;
    }
    if (user.Verified) {
      res.status(400).send({ message: "Mail adresi zaten doğrulanmış" });
      log.app.warn("Init verify email failed: User already verified", {
        mail: email,
        success: false,
      });
      return;
    }

    await Token.upsert(
      {
        UserId: user.UserId,
        Token: token,
        Expiration: Date.now() + 86400000, // 24 hours
        Type: "email",
      },
      {
        where: {
          UserId: user.UserId,
          Type: "email",
        },
      }
    );

    await sendVerifyMail(email, `https://${HOST}/verify/${token}`);
    res.status(200).send();
    log.app.info("Init verify email success", { mail: email, success: true });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Complete the email verification
 */
exports.completeVerify = async (req, res) => {
  const { token } = req.params;
  let user;

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          where: {
            Type: "email",
            Token: token,
            Expiration: {
              [Sequelize.Op.gt]: Date.now(),
            },
          },
          required: true,
        },
      ],
    });

    // If user or token not found, respond with an error
    if (!user) {
      res.status(400).send({
        message: "Doğrulama linki geçersiz veya süresi dolmuştur",
      });
      log.app.warn(
        "Complete verify email failed: Token doesn't exist or expired",
        {
          token,
          success: false,
        }
      );
      return;
    }

    // Time safe comparison for more security
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      res.status(400).send({
        message: "Doğrulama linki geçersiz veya süresi dolmuştur",
      });
      log.app.warn(
        "Complete verify email failed: Token doesn't exist or expired",
        {
          token,
          success: false,
        }
      );
      return;
    }

    // Delete email token
    await Token.destroy({
      where: {
        UserId: user.UserId,
        Type: "email",
      },
    });
    log.app.info("Complete verify email token found and deleted", {
      userId: user.UserId,
      token,
      success: true,
    });

    // Update user verified status
    User.update(
      {
        Verified: true,
      },
      {
        where: {
          UserId: user.UserId,
        },
      }
    );

    res.status(200).send();
    log.app.info("Complete verify email success", {
      userId: user.UserId,
      success: true,
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Permission check
 */
exports.permission = async (req, res) => {
  if (req.user) {
    res.status(200).send({ permission: true, agreement: req.user.Agreement });
  } else {
    res.status(401).send({ permission: false });
  }
};

/**
 * Agreement accept
 * @body aggreement
 */
exports.agree = async (req, res) => {
  const { UserId: userId } = req.user;
  const { ip, device, agent, isMobile } = req.body;

  try {
    await Agreement.findOrCreate({
      where: {
        UserId: userId,
      },
      defaults: {
        UserId: userId,
        IP: ip,
        Device: device ? device.substring(0, 255) : null,
        Agent: agent ? agent.substring(0, 511) : null,
        IsMobile: isMobile,
      },
    });

    await User.update(
      {
        Agreement: true,
      },
      {
        where: {
          UserId: userId,
        },
      }
    );

    res.status(200).send();
    log.audit.info("Agreement accept success", {
      userId,
      action: "PUT",
      success: true,
      resource: {
        type: "user",
        id: userId,
      },
      request: {
        ip: ip,
        device: device,
        agent: agent,
        isMobile: isMobile,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
