import mongoose, { Aggregate, Document, HookNextFunction } from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxLength: [40, 'max length must have less than or equal 40 characters'],
      minLength: [7, 'min length must have less than or equal 40 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have dificulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'allowed difficulties are easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'discount ({VALUE}) cannot be grather than price',
        validator: function (this: { price: number }, val: number) {
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour must have description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function (this: { duration: number }) {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE / RUNS BEFORE .save() and .create()
tourSchema.pre(
  'save',
  function (this: { slug: string; name: string }, next: HookNextFunction) {
    this.slug = slugify(this.name, { lower: true });
    next();
  }
);
//QUERY MIDDLEWARE RUNS BEFORE OR AFTER CERTAIN QUERY IS EXECUTED
tourSchema.pre(/^find/, function (this, next: HookNextFunction): void {
  //@ts-ignore
  this.find({ secretTour: { $ne: true } });
  next();
});

//AGGREGATION MIDDLEWARE - EXCLUDE SECRET TOUR
tourSchema.pre(
  'aggregate',
  function (this: Aggregate<[Object]>, next: HookNextFunction) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
  }
);

export const Tour = mongoose.model('Tour', tourSchema);
