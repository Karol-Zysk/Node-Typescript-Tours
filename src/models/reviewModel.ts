import mongoose, { HookNextFunction, ObjectId, Schema } from 'mongoose';

export interface IreviewDocument extends Document {
  review: string | undefined;
  rating: number;
  createdAt: Date;
  user: ObjectId;
  tour: ObjectId;
}

const reviewSchema: Schema<IreviewDocument> = new mongoose.Schema(
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

reviewSchema.pre(/^find/, function (this, next: HookNextFunction): void {
  this.populate({ path: 'user', select: 'name  photo' });
  next();
});

export const Review = mongoose.model('review', reviewSchema);
