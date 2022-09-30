import { app } from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const DB = `${process.env.DATABASE_CONNECTION}`.replace(
  '<PASSWORD>',
  `${process.env.DATABASE_PASSWORD}`
);

console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listenning at http://localhost:${port}`);
});
