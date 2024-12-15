class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Set default error message and status code if not provided
  err.message = err.message || "Internal server error.";
  err.statusCode = err.statusCode || 500;

  console.log(err); // Log the error for debugging purposes

  // Handle specific error types
  if (err.name === "JsonWebTokenError") {
    // Corrected token name
    const message = "JSON Web Token is invalid. Try again.";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Try again.";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}.`;
    err = new ErrorHandler(message, 400);
  }

  // If the error contains validation errors, format the message
  const errorMessage = err.errors
    ? Object.values(err.errors) // Corrected the typo here (previously it was `err.erros`)
        .map((error) => error.message)
        .join(" ") // Join all error messages with a space
    : err.message; // Fallback to the main error message if no validation errors

  // Send the response with the appropriate status code
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
