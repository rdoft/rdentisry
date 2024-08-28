const log = requeire("../config/log.config");

// Restrictng routes a user is not allowed to visit if not logged in
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }

  res.status(401).send();
  log.access.warn("Unauthorized access", {
    action: "ACCESS",
    success: false,
    request: {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      status: 401,
      agent: req.headers["user-agent"],
    },
  });
  return;
};

module.exports = {
  isAuthenticated,
};
