import mongoose from 'mongoose';
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';

//name email photo password passwordconfirm

const userScheema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], unique: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'this email already exist'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: { type: String, required: true },
});

export const User = mongoose.model('User', userScheema);
