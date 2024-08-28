const log = require("../config/log.config");

//TODO: Debug if these values can taken right
const logMeta = (req, res, next) => {
  const { method, url, ip } = req;
  const userId = req.user?.UserId || null;

  log.error.defaultMeta = {
    ...log.error.defaultMeta,
    userId,
    request: { ip, method, url },
  };
  log.access.defaultMeta = {
    ...log.access.defaultMeta,
    userId,
    request: { ip, method, url },
  };
  log.audit.defaultMeta = {
    ...log.audit.defaultMeta,
    userId,
    request: { ip, method, url },
  };
  log.api.defaultMeta = {
    ...log.api.defaultMeta,
    userId,
    request: { ip, method, url },
  };

  next();
};

module.exports = logMeta;
