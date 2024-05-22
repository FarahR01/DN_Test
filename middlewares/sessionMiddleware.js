const sessionMiddleware = (req, res, next) => {
  if (!req.session.userData) {
    req.session.userData = {};
  }
  next();
};

module.exports = sessionMiddleware;
