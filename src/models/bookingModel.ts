import { Schema, model, HookNextFunction } from 'mongoose';

const bookingSchema = new Schema(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour!'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.pre(/^find/, function (this, next: HookNextFunction) {
  this.populate('user').populate({ path: 'tour', select: 'name' });
  next();
});

export const Booking = model('Booking', bookingSchema);
