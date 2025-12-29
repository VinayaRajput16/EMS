import AppError from "../errors/AppError.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // If error is unexpected, mask details
  const response = {
    message: err.isOperational
      ? err.message
      : "Internal Server Error",
  };

  // Optional: show stack only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
