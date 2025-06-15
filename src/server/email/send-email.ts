import type { Transporter } from "nodemailer";

export async function sendEmail(
  transporter: Transporter,
  fromEmail: string,
  to: string,
  subject: string,
  html: string,
) {
  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error("Failed to send email.");
  }
}
