import nodemailer from 'nodemailer';
import { EmailOptions } from '../interfaces/interfaces';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import { IUserDocument } from '../interfaces/userModelInterfaces';

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUserDocument, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Karol Zyśk <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Hotmail 
      //@ts-ignore
      return nodemailer.createTransport('SMTP', {
        host: process.env.HOTMAIL_HOST,
        port: process.env.HOTMAIL_PORT,
        secureConnection: false,
        auth: {
          user: process.env.HOTMAIL_USERNAME,
          pass: process.env.HOTMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}

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
