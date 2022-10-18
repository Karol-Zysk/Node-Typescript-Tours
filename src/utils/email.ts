import nodemailer from 'nodemailer';
import { EmailOptions } from '../interfaces/interfaces';

export const sendEmail = async (options: EmailOptions) => {
  //Creating transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //Define email options
  const mailOptions = {
    from: 'Karol Zyśk <zysk.karol.pawel@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //send email
  await transporter.sendMail(mailOptions);
};
