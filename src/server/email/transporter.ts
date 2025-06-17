import { env } from '@app/env';
import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: env.EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

const globalForTransporter = globalThis as unknown as {
  transporter: ReturnType<typeof createTransporter> | undefined;
};

export const emailTransporter =
  globalForTransporter.transporter ?? createTransporter();

if (env.NODE_ENV !== 'production')
  globalForTransporter.transporter = emailTransporter;
