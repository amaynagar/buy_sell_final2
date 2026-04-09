function notFoundHandler(req, res) {
  res.status(404).json({ message: "Resource not found" });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.name === "CastError" ? 400 : 500;
  const message = statusCode === 400 ? "Invalid request data" : "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  return res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
