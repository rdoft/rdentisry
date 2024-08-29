const log = require("./log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Get env variables
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  HOSTNAME,
  HOST_SERVER,
  PORT_SERVER,
} = process.env;
const HOST = HOSTNAME || HOST_SERVER || "localhost";
const PORT = PORT_SERVER || 8080;

// Local strategy for username password login
passport.use(
  new LocalStrategy(
    {
      // Our user will sign in using an email, rather than a "username"
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, cb) {
      try {
        const user = await User.findOne({
          where: {
            Email: email,
          },
        });

        // Check user exists
        if (!user) {
          log.access.warn("Login failed: Mail doesn't exist", {
            mail: email,
            success: false,
            action: "LOGIN",
            request: {
              ip: req.ip,
              agent: req.headers["user-agent"],
            },
          });
          return cb(null, false, {
            message: "Kullanıcı adı veya şifre yanlış",
          });
        }

        // Check password is valid
        if (!user.Password) {
          log.access.warn("Login failed: Wrong password", {
            userId: user.UserId,
            mail: email,
            success: false,
            action: "LOGIN",
            request: {
              ip: req.ip,
              agent: req.headers["user-agent"],
            },
          });
          return cb(null, false, {
            message: "Kullanıcı adı veya şifre yanlış",
          });
        }

        const isValid = await bcrypt.compare(password, user.Password);
        if (!isValid) {
          log.access.warn("Login failed: Wrong password", {
            userId: user.UserId,
            mail: email,
            success: false,
            action: "LOGIN",
            request: {
              ip: req.ip,
              agent: req.headers["user-agent"],
            },
          });
          return cb(null, false, {
            message: "Kullanıcı adı veya şifre yanlış",
          });
        }

        log.access.info("Login success", {
          userId: user.UserId,
          mail: email,
          success: true,
          action: "LOGIN",
          request: {
            ip: req.ip,
            agent: req.headers["user-agent"],
          },
        });
        return cb(null, user);
      } catch (err) {
        log.error.error(err);
        return cb(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `https://${HOST}:${PORT}/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Control and create user
        let user = await User.findOne({
          where: {
            Email: profile.emails[0].value,
          },
        });

        if (!user) {
          user = await User.create({
            Email: profile.emails[0].value,
          });
          log.access.info("Register success", {
            mail: user.Email,
            success: true,
            action: "REGISTER",
            request: {
              ip: req.ip,
              agent: req.headers["user-agent"],
            },
          });
        }

        log.access.info("Login success", {
          userId: user.UserId,
          mail: user.Email,
          success: true,
          action: "LOGIN",
          request: {
            ip: req.ip,
            agent: req.headers["user-agent"],
          },
        });
        return cb(null, user);
      } catch (err) {
        log.error.error(err);
        return cb(err);
      }
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
passport.serializeUser(function (user, cb) {
  cb(null, user.UserId);
});

passport.deserializeUser(function (id, cb) {
  User.findByPk(id).then(function (user) {
    cb(null, user);
  });
});

module.exports = passport;
