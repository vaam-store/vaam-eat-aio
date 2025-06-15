import nodemailer from "nodemailer";
import { env } from "@app/env";

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: env.EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Verify connection configuration
  transporter.verify((error, _success) => {
    if (error) {
      console.error("Nodemailer transporter verification failed:", error);
    } else {
      console.log("Nodemailer transporter is ready to send emails");
    }
  });

  return transporter;
};

const globalForTransporter = globalThis as unknown as {
  transporter: ReturnType<typeof createTransporter> | undefined;
};

export const emailTransporter =
  globalForTransporter.transporter ?? createTransporter();

if (env.NODE_ENV !== "production")
  globalForTransporter.transporter = emailTransporter;
