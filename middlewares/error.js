class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
    const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Erreur interne du serveur";
    err.statusCode = err.statusCode || 500;
  
    if (err.name === "CastError") {
      const message = `Ressource non trouvée. ${err.path} invalide`,
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
      const message = `Entrée en double pour ${Object.keys(err.keyValue)}`,
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
      const message = `Le jeton Web JSON est invalide, veuillez réessayer !`;
      err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
      const message = `Le jeton Web JSON a expiré, veuillez réessayer !`;
      err = new ErrorHandler(message, 400);
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
module.exports = { errorMiddleware };
  