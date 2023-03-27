const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const express = require('express');
const Router = express.Router({ mergeParams: true });
// MERGE PARAMS will give access to all params
Router.use(authController.protect);

Router.route('/')
  .get(reviewController.filterByTour, reviewController.getAllReviews)
  .post(
    authController.restrictTo('user', 'admin'),
    reviewController.setTourUserId,
    reviewController.createReview
  );
Router.route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.userOnlyRestrict, reviewController.deleteReview);
module.exports = Router;
