const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const handlerFactory = require('./handlerFactory');

const filterObj = (body, ...allowedFileds) => {
  const filteredBody = {};
  Object.keys(body).forEach((el) => {
    if (allowedFileds.includes(el)) {
      filteredBody[el] = body[el];
    }
  });
  return filteredBody;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not implemented, please signup',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create an error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'This route is not defined for password updates, please use /updatePassword',
        400
      )
    );
  }
  // 2. Update the user document
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
  next();
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getUser = handlerFactory.getOne(User);
exports.getAllUsers = handlerFactory.getAll(User);
exports.deleteUser = handlerFactory.deleteone(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
