export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  return res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message,
    ...(err.details ? { details: err.details } : {})
  });
}
