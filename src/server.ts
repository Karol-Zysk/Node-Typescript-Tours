import { app } from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Tour } from './models/tourModel';

dotenv.config({ path: './.env' });

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

const testTour = new Tour({
  name: 'New Tour',
  rating: 4.7,
  price: 4000,
});

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listenning at http://localhost:${port}`);
});
