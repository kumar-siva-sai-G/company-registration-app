const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  const errors = err.errors || null;

  res.status(status).json({
    success: false,
    message,
    errors,
  });
};

module.exports = errorHandler;