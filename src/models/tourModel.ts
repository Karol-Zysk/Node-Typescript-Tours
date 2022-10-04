import mongoose from 'mongoose';

 const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'tour must have name'],
      unique: true,
    },
    rating: { type: Number, default: 4.5 },
    price: {
      type: Number,
      required: [true, 'tour must have price'],
    },
  });
  
  export const Tour = mongoose.model('Tour', tourSchema);