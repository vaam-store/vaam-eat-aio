import { render } from '@react-email/render';
import type { Transporter } from 'nodemailer';
import type { JSXElementConstructor, ReactElement } from 'react';

/**
 * Sends an email using the provided transporter.
 * The `html` parameter can accept either a string (legacy HTML) or a React component (JSX.Element or ReactElement).
 * If a React component is provided, it will be rendered to HTML using `@react-email/render`.
 */
export async function sendEmail(
  transporter: Transporter,
  fromEmail: string,
  to: string,
  subject: string,
  html: string | ReactElement | JSXElementConstructor<any>,
) {
  let emailHtml: string;

  if (typeof html === 'string') {
    emailHtml = html;
  } else {
    emailHtml = await render(html as ReactElement);
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html: emailHtml,
    });
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error('Failed to send email.');
  }
}
