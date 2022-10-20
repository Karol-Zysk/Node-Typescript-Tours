import mongoose, { Model, ObjectId, Schema } from 'mongoose';

export interface IReviewDocument {
  text: string | undefined;
  rating: number;
  createdAt: Date;
  user: ObjectId;
  tour: ObjectId;
}

const reviewSchema: Schema<IReviewDocument> = new mongoose.Schema(
  {
    text: {
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

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
