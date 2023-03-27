const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const APIfeatures = require('./../utils/APIFeatures');
const handlerFactory = require('./handlerFactory');
const Tour = require('./../models/tourModel');

exports.filterByTour = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  req.doc = filter;
  next();
});

exports.userOnlyRestrict = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  // if(review.user !== req.params.id)
  const ifCheck = review.user._id == req.user.id;
  if (!(ifCheck || req.user.role == 'admin')) {
    return next(
      new appError("You don't have permission to delete this review ")
    );
  }
  next();
});

exports.setTourUserId = async (req, res, next) => {
  if (!req.body.tour) {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) {
      return next(new appError('Cannot find a tour'));
    }
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review, null);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteone(Review);
