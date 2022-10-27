import mongoose, { Model, ObjectId, Query, Schema } from 'mongoose';
import { Tour } from './tourModel';

export interface IReviewDocument {
  review: string | undefined;
  rating: number;
  createdAt: Date;
  user: ObjectId;
  tour: ObjectId;
}

const reviewSchema: Schema<IReviewDocument> = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cannot be empty'],
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
      required: [true, 'please set rating'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user'],
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    options: { select: 'name photo' },
  });

  next();
});

reviewSchema.static('calcRatingAvgAndReviewCount', async function (tourId) {
  const [result] = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        ratingsAverage: { $avg: '$rating' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (!result) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
    return;
  }
  const { ratingsAverage, ratingsQuantity } = result;
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage,
    ratingsQuantity,
  });
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(
  'save',
  function (
    this: {
      tour: string;
      constructor: { calcRatingAvgAndReviewCount: Function };
    },
    next
  ) {
    this.constructor.calcRatingAvgAndReviewCount(this.tour);
    next();
  }
);

reviewSchema.pre(
  /^findOneAnd/,
  async function (this: Query<any, any, {}, any>): Promise<void> {
    //@ts-ignore
    this.review = await this.model.findOne();
  }
);
reviewSchema.post(
  /^findOneAnd/,
  async function (this: Query<any, any, {}, any>) {
    //@ts-ignore
    await this.review.constructor.calcRatingAvgAndReviewCount(this.review.tour);
  }
);

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
