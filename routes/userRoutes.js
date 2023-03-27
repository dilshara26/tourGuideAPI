const express = require('express');
const Router = express.Router();
const userControllers = require('./../controllers/userContoller');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);
Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

// LOGGED IN SECTION
Router.use(authController.protect);

Router.patch(
  '/updatePassword',

  authController.updatePassword
);
Router.patch('/updateMe', userControllers.updateMe);
Router.patch('/deleteUser', userControllers.deleteMe);
Router.get('/getMe', userControllers.getMe, userControllers.getUser);

// ADMIN SECTION
Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

Router.route('/:id')
  .get(userControllers.getUser)
  .delete(authController.restrictTo('admin'), userControllers.deleteUser)
  .patch(authController.restrictTo('admin'), userControllers.updateUser);

module.exports = Router;
