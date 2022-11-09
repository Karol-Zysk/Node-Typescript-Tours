import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { app } from './app';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection, Shutting Down');
  process.exit(1);
});

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

const server = app.listen(port, () => {
  console.log(`App listenning at http://localhost:${port}`);
});

process.on('unhandledRejection', (err: any) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection, Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM--> A signal that stops the program from running
process.on('SIGTERM', () => {
  console.log('👋zz SIGTERM RECEIVED, shutting down gracefully');
  server.close(() => {
    console.log('💥 process terminated');
  });
});
