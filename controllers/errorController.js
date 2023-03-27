const AppError = require('../utils/appError');

handleCastError = (err) => {
  const val = err.value;

  const message = `Invalid ${err.path}: ${val}`;
  return new AppError(message, 400);
};
handleDublicateTours = (err) => {
  const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/);

  const message = `Duplicating field value ${value[0]}`;
  return new AppError(message, 500);
};
handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Data : ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
  });
};
const handleTokenExpiredError = (err) =>
  new AppError('Token Expired, please log in back', 401);
const handleJsonWebTokenError = (err) =>
  new AppError('Invalid Token, Please log in again.', 401);

const sendErrorProduction = (err, res) => {
  // operational error we trust: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // promramming of other unknown error : dont leak the error details
    res.status(500).json({
      status: err.status,
      message: 'something is very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    // console.log(err);
    if (error.name === 'CastError') error = handleCastError(error);

    if (error.code == 11000) error = handleDublicateTours(error);

    if (error.name === 'ValidationError') error = handleValidationError(error);

    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);

    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    sendErrorProduction(error, res);
  }
};
