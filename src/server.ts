import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { app } from './app';
import mongoose from 'mongoose';

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


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listenning at http://localhost:${port}`);
});
