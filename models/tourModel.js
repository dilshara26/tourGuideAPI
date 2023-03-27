const slugify = require('slugify');
const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [
        10,
        'A tour name must have more than or equal characters than 10',
      ],
      // validate: [validator.isAlpha, 'A tour must have values in between A-Z'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'The duration must be there in a tour'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'The max group size must be there in a tour'],
    },
    difficulty: {
      type: String,
      default: 4.5,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be easy, medium or difficult',
      },
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Ratings average should be greater than 1.0'],
      max: [5, 'Ratings average should be lesser than 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    pricedDiscount: {
      type: Number,
      validate: {
        // this is only pointing towards curretnly created doc
        validator: function (val) {
          return val < this.price;
        },
        message: 'The discount Price should be always lesser than price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinate: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    startDates: [Date],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function (params) {
  return this.duration / 7;
});

// VIRTUAL REFFERENCE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// DOCUMENT MIDDLEWARE RUNS BEFORE THE .save and .create

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});
// qurey middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (doc, next) {
  console.log(Date.now() - this.start);

  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());

  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
