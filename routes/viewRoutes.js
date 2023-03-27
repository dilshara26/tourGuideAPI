const express = require('express');
const Router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('./../controllers/authController');

// routes
// Router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Dilshara',
//   });
// });
Router.use(authController.isLoggedIn);
Router.get('/', viewController.getOverview);
Router.get('/tour/:slug', viewController.getTour);
Router.get('/login/', viewController.getLogin);

module.exports = Router;
