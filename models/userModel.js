const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address.'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'The password is too short and atelast need 6 characters.'],
    maxlength: [
      20,
      'The password is too long and should be below 20 characters.',
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // this is only pointing towards curretnly created doc
      validator: function (val) {
        return val === this.password;
      },
      message: 'Your passwords should match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // ENCRYPTING THE PASSWORD
    this.password = await bcrypt.hash(this.password, 12);
    // the password confirm should be there just for confimration, not to pass on to the database
    this.passwordConfirm = undefined;
  }
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async function correctPassword(
  password,
  userPassword
) {
  return await bcrypt.compare(password, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimeStamp, JWTTimestamp);
    if (changedTimeStamp > JWTTimestamp) {
      return true;
    }
  }
  // Fasle means not changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
