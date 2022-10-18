import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { Tour } from '../../models/tourModel';


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

const tours = JSON.parse(
  readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

export const seederScript = async () => {
  try {
    await Tour.deleteMany().then(() => console.log('data succesfully deleted'));

    await Tour.create(tours).then(() =>
      console.log('data sucsessfully loaded')
    );

    await mongoose.disconnect().then(() => console.log('already disconnected'));
  } catch (err) {
    console.log(err);
  }
};

seederScript();
