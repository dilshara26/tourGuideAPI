const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('./../utils/appError');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signupToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createAndSendToken = (user, statusCode, res) => {
  const token = signupToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createAndSendToken(newUser, 201, res);

  // const token = signupToken(newUser._id);

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. Check if the email or password has been typed
  if (!email || !password) {
    return next(new appError('Please enter a valid email and password', 400));
  }

  // 2. Check if the email and password is correct
  const user = await User.findOne({ email }).select('+password'); // since the password is hidden by default, needed to specifically select that field

  console.log(await user.correctPassword(password, user.password));
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Invalid email or password', 401));
  }

  // 3. if everythings okay, send the toekn to the client
  createAndSendToken(user, 200, res);
  // const token = signupToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting the token and check it exists
  let token;

  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new appError('You need to first login', 401));
  }

  // 2. Verify the Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


  // 3. check if the user still exists
  const userExist = await User.findById(decoded.id);
  if (!userExist) {
    return next(
      new appError('The user belong to the Token no longer exist', 401)
    );
  }
  // 4. if user changed password after the JWT was issued
  const changedThePassword = userExist.changedPasswordAfter(decoded.iat);
  if (changedThePassword) {
    return next(
      new appError('The token has expired due to password changed', 401)
    );
  }
  req.user = userExist;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("There's no user with given email address", 404));
  }

  // 2. Generate the Random Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3. Send it back as email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Ssubmit a PATCH request with your new password and password confirm to : ${resetURL}.\nIf you didn't forget your password, please ignore this email! `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message: message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2 If token has not expired, and there is user, set new password
  if (!user) {
    return next(new appError('Token is invalid or expired', 400));
  }
  // 3 Update changedPassword property
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //  4 Log user in and send JWT
  createAndSendToken(user, 200, res);
  // const token = signupToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 Get user from the collection
  const userId = req.user.id;
  const user = await User.findById(userId).select('+password');
  // if (!user) {
  //   return new appError('You need to log in first', 500);
  // }
  // 2 check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
    return next(new appError('You need to log in first', 500));
  }

  // 3 If so, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  // user.passwordChangedAt = Date.now() - 1;
  await user.save();

  //  4 Log user in and send
  const token = signupToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  // 1. Getting the token and check it exists
  let token;

  if (req.cookies.jwt) {
    try{
      token = req.cookies.jwt;
  
      // 2. Verify the Token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
      // 3. check if the user still exists
      const userExist = await User.findById(decoded.id);
      if (!userExist) {
        return next();
      }
      // 4. if user changed password after the JWT was issued
      const changedThePassword = userExist.changedPasswordAfter(decoded.iat);
      if (changedThePassword) {
        return next();
      }
      // There is an logged in User
      res.locals.user =  userExist;
      // console.log(`testing user ${res.locas.user}`)
      return next();

    }catch(err) {
      return next()
    }
  }
  console.log(`testing user`)
  next();
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', { 
    expires: new Date(Date.now()+ (10*1000)),
    httpOnly: true
  })
  res.status(200).json({ status: 'success' })
}