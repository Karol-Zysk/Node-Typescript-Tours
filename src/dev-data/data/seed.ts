import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { Review } from '../../models/reviewModel';
import { Tour } from '../../models/tourModel';
import { User } from '../../models/userModel';

const DB = `${process.env.DATABASE_CONNECTION}`.replace(
  '<PASSWORD>',
  `${process.env.DATABASE_PASSWORD}`
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('connection good ');
  });

const tours = JSON.parse(readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));

export const seederScript = async () => {
  try {
    await Tour.deleteMany().then(() =>
      console.log('tours succesfully deleted')
    );
    await Review.deleteMany().then(() =>
      console.log('reviews succesfully deleted')
    );
    await User.deleteMany().then(() =>
      console.log('users succesfully deleted')
    );

    await Tour.create(tours).then(() =>
      console.log('tours sucsessfully loaded')
    );
    await User.create(users, { validateBeforeSave: false }).then(() =>
      console.log('users sucsessfully loaded')
    );
    await Review.create(reviews).then(() =>
      console.log('reviwes sucsessfully loaded')
    );

    // await mongoose.disconnect().then(() => console.log('already disconnected'));
  } catch (err) {
    console.log(err);
  }
};

seederScript();
