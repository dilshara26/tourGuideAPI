'use strict';
const path = require('path');
const { strict } = require('assert');
const { application } = require('express');
const express = require('express');
const req = require('express/lib/request');
const fs = require('fs');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')

const app = express();
// Set up the PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');

// Require All Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// GLOBAL middleware
// 1. Setting HTTPS headers
app.use(helmet());

// 2. Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. limit request from some API
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from IP, please try again in an hour',
});
app.use('/api', limiter);

//4. body parser, reading data from body in to req.body
app.use(express.json({ limit: '10kb' }));
// 4.1 Take cookies in an HTTP request
app.use(cookieParser());

// 4.2 Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// 4.3 Data sanitization against XSS
app.use(xss());

// 6. Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'max', 'maxGroupSize', 'price'],
  })
);

//7. custom Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies)

  next();
});

// // respond the user with the JSON data
// app.get('/api/v1/tours', getAllTours);

// // respond the user with the JSON data
// app.get('/api/v1/tours/:id', getTour);

// // take up data from the clients end
// app.post('/api/v1/tours', createTour);

// // UPDATE THE TRIP
// app.patch('/api/v1/tours/:id', updateTour);

// // DELETE THE TOUR
// app.delete('/api/v1/tours/:id', deleteTour);

// routes

// MOUNTING THE ROUTERS
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRoutes);
// for all the unhandled requests. Make sure to put this handler after all the handlers
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',ss
  //   message: `Can't find ${req.originalUrl} on the server !`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on the server !`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
